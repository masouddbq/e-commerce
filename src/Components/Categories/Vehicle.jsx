import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ProductCard from '../Common/ProductCard';

const Vehicle = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicleProducts();
  }, []);

  const fetchVehicleProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // دریافت محصولات با نوع خودرو "سواری"
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('vehicleType', 'سواری')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Error fetching vehicle products:', supabaseError);
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
        <div className="text-xl">در حال بارگذاری محصولات سواری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={fetchVehicleProducts}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            تلاش مجدد
          </button>
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
              محصولات خودروهای سواری
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              بهترین لنت‌های ترمز برای خودروهای سواری با کیفیت تضمینی
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              هیچ محصولی برای خودروهای سواری یافت نشد
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
  );
};

export default Vehicle;