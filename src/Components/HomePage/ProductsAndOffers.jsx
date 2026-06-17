import React from 'react';
import FeaturedProducts from './FeaturedProducts';
import ProductRows from './ProductRows';

const ProductsAndOffers = () => {
  return (
    <div className="w-full">
      {/* محصولات ویژه و جدید */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">محصولات ویژه و جدید</h2>
            <p className="text-gray-600">بهترین محصولات ما را با قیمت‌های استثنایی تجربه کنید</p>
          </div>
          
          {/* Featured Products */}
          <FeaturedProducts />
        </div>
      </div>

      {/* ردیف‌های محصولات: جدید، پرفروش، تخفیف‌دار */}
      <ProductRows />
    </div>
  );
};

export default ProductsAndOffers;
