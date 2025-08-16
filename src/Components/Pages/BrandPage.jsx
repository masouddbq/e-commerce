import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ProductCard from '../Common/ProductCard';

const BrandPage = () => {
  const { brandSlug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // تبدیل slug به نام فارسی برند
  const getBrandNameFromSlug = (slug) => {
    const brandMap = {
      'toyota': 'تویوتا',
      'hyundai': 'هیوندای',
      'nissan': 'نیسان',
      'kia': 'کیا',
      'lexus': 'لکسوس',
      'geely': 'جیلی',
      'mazda': 'مزدا',
      'mg': 'ام‌جی',
      'mitsubishi': 'میتسوبیشی',
      'volkswagen': 'فولکس‌واگن',
      'saipa': 'سایپا',
      'suzuki': 'سوزوکی',
      'renault': 'رنو',
      'peugeot': 'پژو',
      'irankhodro': 'ایران خودرو',
      'faw': 'فاو',
      'jac': 'جی‌ای‌سی'
    };
    return brandMap[slug] || slug;
  };

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setError(null);
      const brandName = getBrandNameFromSlug(brandSlug);
      
      // نام‌های معادل برای برخی برندها (برای پشتیبانی از نگارش‌های مختلف)
      const synonymBase = {
        'volkswagen': ['فولکس‌واگن', 'فولکس واگن'],
        'mg': ['ام‌جی', 'ام جی'],
        'irankhodro': ['ایران‌خودرو', 'ایران خودرو'],
        'jac': ['جی‌ای‌سی', 'جک']
      };

      const baseNames = synonymBase[brandSlug] || [brandName];

      // پذیرش هر دو حالت نیم‌فاصله و فاصله معمولی برای همه نام‌های معادل
      const brandVariants = Array.from(new Set(
        baseNames.flatMap((n) => (n ? [
          n,
          n.replace(/\u200c/g, ' ').trim(),
          n.replace(/\s+/g, '\u200c').trim()
        ] : []))
      )).filter(Boolean);
      
      // دریافت اطلاعات برند
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .in('name', brandVariants)
        .single();

      if (brandError && brandError.code !== 'PGRST116') {
        console.error('Error fetching brand:', brandError);
        throw new Error('خطا در دریافت اطلاعات برند');
      }

      setBrand(brandData || { name: brandName, description: `محصولات برند ${brandName}` });

      // دریافت محصولات برند (هر دو حالت نیم‌فاصله و فاصله)
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('brand', brandVariants)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw new Error('خطا در دریافت محصولات');
      }

      setProducts(productsData || []);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchBrandData();
  };

  useEffect(() => {
    if (brandSlug) {
      fetchBrandData();
    }

    // Real-time subscription برای محصولات
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Real-time product change:', payload);
          // بروزرسانی خودکار محصولات
          fetchBrandData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brandSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              تلاش مجدد
            </button>
            <div className="text-sm text-gray-500">
              تلاش {retryCount + 1} از 3
            </div>
            <Link to="/" className="block text-blue-600 hover:underline text-sm">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              محصولات برند {brand?.name}
            </h1>
            {brand?.description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {brand.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              هیچ محصولی برای این برند یافت نشد
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-right">
                محصولات ({products.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  brandSlug={brandSlug}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
