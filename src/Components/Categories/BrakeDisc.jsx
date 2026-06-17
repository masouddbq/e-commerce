import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../lib/supabase';
import ProductCard from '../Common/ProductCard';

const BrakeDisc = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrakeDiscProducts();
  }, []);

  const fetchBrakeDiscProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // دریافت محصولات با نوع "دیسک ترمز"
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('vehicleType', 'دیسک ترمز')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Error fetching brake disc products:', supabaseError);
        throw new Error('خطا در دریافت محصولات');
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">در حال بارگذاری محصولات دیسک ترمز...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={fetchBrakeDiscProducts}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>دیسک ترمز | خرید دیسک ترمز خودرو | لنت شاپ</title>
        <meta name="description" content="خرید دیسک ترمز خودرو - دیسک ترمز جلو، دیسک ترمز عقب برای تمام برندها. بهترین قیمت و کیفیت تضمینی. ارسال سریع به سراسر کشور." />
        <meta name="keywords" content="دیسک ترمز, دیسک ترمز خودرو, دیسک ترمز جلو, دیسک ترمز عقب, خرید دیسک ترمز" />
        <meta property="og:title" content="دیسک ترمز | لنت شاپ" />
        <meta property="og:description" content="خرید دیسک ترمز خودرو با بهترین قیمت و کیفیت" />
        <meta property="og:url" content="https://lent-shop.ir/brake-disc" />
        <link rel="canonical" href="https://lent-shop.ir/brake-disc" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              محصولات دیسک ترمز
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              بهترین دیسک‌های ترمز با کیفیت تضمینی و قیمت مناسب
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              هیچ محصولی برای دیسک ترمز یافت نشد
            </div>
            <p className="text-gray-400 text-sm">
              محصولات جدید به زودی اضافه خواهند شد
            </p>
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
                  brandSlug={product.brand?.toLowerCase()}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default BrakeDisc;

