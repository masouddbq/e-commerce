import React from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FeaturedProducts from './FeaturedProducts';
import SpecialOffers from './SpecialOffers';

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

      {/* بخش تخفیف‌های ویژه */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <LocalOfferIcon className="text-red-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">تخفیف‌های ویژه</h2>
            <p className="text-gray-600">فرصت‌های طلایی خرید با بهترین قیمت‌ها</p>
          </div>
          
          <SpecialOffers />
        </div>
      </div>
    </div>
  );
};

export default ProductsAndOffers;
