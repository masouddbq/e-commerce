import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, brandSlug }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-200 flex flex-col h-full">
      <div className="h-40 bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-500 text-lg">تصویر {product.name}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        {/* سطر اول: نام محصول وسط چین */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center min-h-[3rem] flex items-center justify-center">
          {product.name}
        </h3>
        
        {/* سطر دوم: برند و دسته‌بندی */}
        <div className="flex justify-between items-center mb-3 min-h-[1.5rem]">
          <span className="text-sm text-blue-600 font-semibold">{product.brand}</span>
          <span className="text-sm text-gray-600">{product.category}</span>
        </div>
        
        {/* سطر سوم: مناسب برای خودروهای فلان */}
        <div className="min-h-[3rem] flex items-center justify-center mb-3">
          <p className="text-sm text-gray-600 text-center">{product.suitableFor || "—"}</p>
        </div>
        
        {/* سطر چهارم: وضعیت موجودی */}
        <div className="min-h-[1.5rem] flex items-center justify-center mb-3">
          <p className="text-sm text-green-600 font-semibold">{product.stockStatus}</p>
        </div>
        
        {/* سطر آخر: قیمت و دکمه */}
        <div className="text-center mt-auto">
          <div className="text-lg font-bold text-blue-600 mb-3">{product.price} تومان</div>
          <div className="grid grid-cols-3 gap-2">
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
