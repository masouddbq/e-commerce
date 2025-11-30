import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getBrandImage } from '../../lib/utils';
import ProductCard from '../Common/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const BrandPage = () => {
  const { brandSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('');
  const [productsError, setProductsError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log('BrandPage mounted with brandSlug:', brandSlug);
    fetchBrandData();
  }, [brandSlug]);

  // نام‌های معادل برای برخی برندها (برای پشتیبانی از نگارش‌های مختلف)
  const synonymBase = {
    'volkswagen': ['فولکس‌واگن', 'فولکس واگن'],
    'mg': ['ام‌جی', 'ام جی'],
    'irankhodro': ['ایران‌خودرو', 'ایران خودرو'],
    'jac': ['جی‌ای‌سی', 'جک'],
    'bmw': ['بی‌ام‌دبلیو', 'بی‌ام‌دبلیو', 'BMW', 'بی‌ام‌دبلیو', 'بی‌ام‌دبلیو', 'بی‌ام‌دبلیو'],
    'benz': ['بنز', 'مرسدس', 'مرسدس بنز'],
    'mercedes': ['مرسدس', 'بنز', 'مرسدس بنز']
  };

  // دریافت عکس پیش‌فرض برند
  const getDefaultBrandImage = (brandName) => {
    // استفاده از سیستم متمرکز
    return getBrandImage(brandName);
  };

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
      'jac': 'جی‌ای‌سی',
      // برندهای جدید اضافه شده
      'bmw': 'بی‌ام‌دبلیو',
      'changan': 'چانگان',
      'amico': 'آمیکو',
      'brilliance': 'برلیانس',
      'benz': 'بنز',
      'mercedes': 'مرسدس'
    };
    return brandMap[slug] || slug;
  };

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      setProductsError(null);
      const brandName = getBrandNameFromSlug(brandSlug);
      
      // نام‌های معادل برای برخی برندها (برای پشتیبانی از نگارش‌های مختلف)
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
        // در صورت عدم وجود برند در جدول brands، از نام برند استفاده کن
        console.log('Brand not found in brands table, using brand name directly');
      }

      setBrandName(brandData?.name || brandName);

      // دریافت محصولات برند (هر دو حالت نیم‌فاصله و فاصله)
      console.log('Fetching products for brand variants:', brandVariants);
      
      // تست چندین روش جستجو
      let productsData = [];
      let productsError = null;
      
      // روش 1: جستجوی دقیق
      const { data: exactMatch, error: exactError } = await supabase
        .from('products')
        .select('*')
        .in('brand', brandVariants)
        .order('created_at', { ascending: false });
      
      if (exactMatch && exactMatch.length > 0) {
        productsData = exactMatch;
        console.log('Method 1 (exact match) successful:', exactMatch.length, 'products');
      } else {
        console.log('Method 1 failed, trying method 2...');
        
        // روش 2: جستجوی fuzzy
        const { data: fuzzyMatch, error: fuzzyError } = await supabase
          .from('products')
          .select('*')
          .or(brandVariants.map(brand => `brand.ilike.%${brand}%`).join(','))
          .order('created_at', { ascending: false });
        
        if (fuzzyMatch && fuzzyMatch.length > 0) {
          productsData = fuzzyMatch;
          console.log('Method 2 (fuzzy match) successful:', fuzzyMatch.length, 'products');
        } else {
          console.log('Method 2 failed, trying method 3...');
          
          // روش 3: جستجوی partial
          const { data: partialMatch, error: partialError } = await supabase
            .from('products')
            .select('*')
            .or('brand.ilike.%بی‌ام%,brand.ilike.%BMW%,brand.ilike.%بی‌ام‌دبلیو%')
            .order('created_at', { ascending: false });
          
          if (partialMatch && partialMatch.length > 0) {
            productsData = partialMatch;
            console.log('Method 3 (partial match) successful:', partialMatch.length, 'products');
          } else {
            console.log('Method 3 failed, trying method 4...');
            
            // روش 4: جستجوی گسترده‌تر
            const { data: wideMatch, error: wideError } = await supabase
              .from('products')
              .select('*')
              .or('brand.ilike.%بی‌ام%,brand.ilike.%BMW%,brand.ilike.%بی‌ام‌دبلیو%,brand.ilike.%بی‌ام‌دبلیو%,brand.ilike.%بی‌ام‌دبلیو%')
              .order('created_at', { ascending: false });
            
            if (wideMatch && wideMatch.length > 0) {
              productsData = wideMatch;
              console.log('Method 4 (wide match) successful:', wideMatch.length, 'products');
            } else {
              console.log('All methods failed');
              productsError = wideError;
            }
          }
        }
      }

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw new Error('خطا در دریافت محصولات');
      }

      console.log('Products found:', productsData?.length || 0, 'for brand:', brandName);
      console.log('Brand variants searched:', brandVariants);
      console.log('Final products data:', productsData);
      
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error:', error);
      setProductsError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // تابع برای تست دیتابیس
  const testDatabaseQuery = async () => {
    try {
      console.log('=== شروع تست جامع دیتابیس ===');
      console.log('1. برند Slug:', brandSlug);
      
      // تست 1: دریافت همه محصولات
      const { data: allProducts, error: allProductsError } = await supabase
        .from('products')
        .select('*');
      
      console.log('1. همه محصولات:', {
        count: allProducts?.length || 0,
        error: allProductsError
      });
      
      // تست 2: محصولات با ID های 11-114
      const { data: specificProducts, error: specificError } = await supabase
        .from('products')
        .select('*')
        .gte('id', 11)
        .lte('id', 114);
      
      console.log('2. محصولات با ID 11-114:', {
        count: specificProducts?.length || 0,
        error: specificError
      });
      
      // تست 3: محصولات BMW
      const { data: bmwProducts, error: bmwError } = await supabase
        .from('products')
        .select('*')
        .or('brand.ilike.%بی‌ام%,brand.ilike.%BMW%,brand.ilike.%بی‌ام‌دبلیو%');
      
      console.log('3. محصولات BMW:', {
        count: bmwProducts?.length || 0,
        error: bmwError
      });
      
      // تست 4: همه برندهای موجود در محصولات
      const { data: allBrands, error: brandsError } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .not('brand', 'eq', '');
      
      const uniqueBrands = [...new Set(allBrands?.map(p => p.brand) || [])].sort();
      console.log('4. همه برندهای موجود در محصولات:', {
        count: uniqueBrands.length,
        brands: uniqueBrands,
        error: brandsError
      });
      
      // تست 5: بررسی جدول brands
      const { data: brandsTable, error: brandsTableError } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      console.log('5. جدول brands:', {
        count: brandsTable?.length || 0,
        names: brandsTable?.map(b => b.name) || [],
        error: brandsTableError
      });
      
      console.log('=== پایان تست جامع دیتابیس ===');
      
    } catch (error) {
      console.error('خطا در تست دیتابیس:', error);
    }
  };

  // تابع برای تلاش مجدد
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchBrandData();
    }
  };

  useEffect(() => {
    if (brandSlug) {
      console.log('BrandPage mounted with slug:', brandSlug);
      fetchBrandData();
      
      // تست دیتابیس برای دیباگ
      if (brandSlug === 'bmw') {
        setTimeout(() => testDatabaseQuery(), 1000);
      }
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

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-xl mb-4">{productsError}</div>
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
              محصولات برند {brandName}
            </h1>
            {brandName && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                توضیحات برند: {brandName}
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
            <div className="text-sm text-gray-400 mb-4">
              برند: {brandName} | Slug: {brandSlug}
            </div>
            <div className="text-xs text-gray-300 mb-4">
              تعداد محصولات: {products.length}
            </div>
            
            {/* دکمه تست برای دیباگ */}
            {brandSlug === 'bmw' && (
              <div className="space-y-2 mb-4">
                <button
                  onClick={testDatabaseQuery}
                  className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  تست جامع دیتابیس (دیباگ)
                </button>
                <div className="text-xs text-gray-400">
                  این دکمه را کلیک کنید و Console را بررسی کنید
                </div>
              </div>
            )}
            
            <Link 
              to="/" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
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
