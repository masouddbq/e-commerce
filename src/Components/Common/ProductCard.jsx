import React from 'react';
import { Link } from 'react-router-dom';
import { formatPriceWithUnit } from '../../lib/utils';

const ProductCard = ({ product, brandSlug }) => {
  // تبدیل brandSlug به نام فارسی برای مسیر
  const getBrandSlug = (brand) => {
    const brandMap = {
      'تویوتا': 'toyota',
      'هیوندای': 'hyundai',
      'نیسان': 'nissan',
      'کیا': 'kia',
      'لکسوس': 'lexus',
      'جیلی': 'geely',
      'مزدا': 'mazda',
      'ام‌جی': 'mg',
      'ام جی': 'mg',
      'میتسوبیشی': 'mitsubishi',
      'فولکس‌واگن': 'volkswagen',
      'فولکس واگن': 'volkswagen',
      'سایپا': 'saipa',
      'سوزوکی': 'suzuki',
      'رنو': 'renault',
      'پژو': 'peugeot',
      'ایران‌خودرو': 'irankhodro',
      'فاو': 'faw',
      'جی‌ای‌سی': 'jac',
      'جک': 'jac'
    };
    return brandMap[brand] || brand.toLowerCase();
  };

  const brandSlugForRoute = getBrandSlug(product.brand);
  const padBrand = product.padBrand || product.padbrand || null;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-200 flex flex-col h-full">
      {/* تصویر محصول */}
      <div className="h-40 bg-gray-200 flex items-center justify-center flex-shrink-0">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span className="text-gray-500 text-lg" style={{ display: product.image ? 'none' : 'flex' }}>
          تصویر {product.name}
        </span>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        {/* نام محصول */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center min-h-[3rem] flex items-center justify-center leading-tight">
          {product.name}
        </h3>
        
        {/* نوع برند لنت و دسته‌بندی (بدون نمایش نام برند شرکت) */}
        <div className="flex justify-between items-center mb-3 min-h-[1.5rem]">
          {padBrand && (
            <span className="text-sm text-pink-600 font-semibold">{padBrand}</span>
          )}
          <span className="text-sm text-gray-600">{product.category}</span>
        </div>
        
        {/* مناسب برای خودروهای */}
        <div className="min-h-[3rem] flex items-center justify-center mb-3">
          <p className="text-sm text-gray-600 text-center">
            {product.suitableFor || "—"}
          </p>
        </div>
        
        {/* قیمت و موجودی */}
        <div className="text-center mb-3">
          <div className="text-lg font-bold text-blue-600">
            {formatPriceWithUnit(product.price)}
          </div>
          {product.originalPrice && product.originalPrice !== product.price && (
            <div className="text-sm text-red-500 line-through">
              {formatPriceWithUnit(product.originalPrice)}
            </div>
          )}
          <div className="text-sm text-green-600 font-semibold mt-1">
            موجودی: {product.stockCount || 0}
          </div>
        </div>
        
        {/* دکمه‌ها */}
        <div className="mt-auto">
          <div className="grid grid-cols-4 gap-2">
            <button className="col-span-2 bg-blue-600 text-white py-2 px-1 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm">
              افزودن به سبد خرید
            </button>
            <Link 
              to={`/product/${brandSlugForRoute}/${product.id}`}
              className="col-span-2 bg-gray-100 text-gray-700 py-1 px-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold border border-gray-300 text-sm flex items-center justify-center"
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
