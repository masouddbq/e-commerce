import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, brandSlug }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-200 flex flex-col h-full">
      {/* Product Image */}
      <div className="h-32 sm:h-36 md:h-40 bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-500 text-sm sm:text-base md:text-lg px-2 text-center">تصویر {product.name}</span>
      </div>
      
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
        {/* Product Name */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center leading-tight">
          {product.name}
        </h3>
        
        {/* Brand and Category */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 space-y-1 sm:space-y-0">
          <span className="text-xs sm:text-sm text-blue-600 font-semibold text-center sm:text-right">{product.brand}</span>
          <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">{product.category}</span>
        </div>
        
        {/* Suitable For */}
        <div className="min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed px-1">{product.suitableFor || "—"}</p>
        </div>
        
        {/* Stock Status */}
        <div className="min-h-[1.5rem] flex items-center justify-center mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-green-600 font-semibold">{product.stockStatus}</p>
        </div>
        
        {/* Price and Buttons */}
        <div className="text-center mt-auto">
          <div className="text-base sm:text-lg font-bold text-blue-600 mb-2 sm:mb-3">{product.price} تومان</div>
          
          {/* Mobile Layout */}
          <div className="block sm:hidden space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm">
              افزودن به سبد خرید
            </button>
            <Link 
              to={`/product/${brandSlug}/${product.id}`}
              className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold border border-gray-300 text-sm flex items-center justify-center"
            >
              مشخصات کالا
            </Link>
          </div>
          
          {/* Desktop/Tablet Layout */}
          <div className="hidden sm:grid grid-cols-3 gap-2">
            <button className="col-span-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm">
              افزودن به سبد خرید
            </button>
            <Link 
              to={`/product/${brandSlug}/${product.id}`}
              className="col-span-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold border border-gray-300 text-sm flex items-center justify-center"
            >
              مشخصات کالا
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
