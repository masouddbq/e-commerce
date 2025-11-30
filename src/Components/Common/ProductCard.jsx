import React from 'react';
import { Link } from 'react-router-dom';
import { formatPriceWithUnit } from '../../lib/utils';
import { useCart } from './CartContext';
import Button from './Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';

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

  const { addToCart, openCart } = useCart();

  const handleAdd = () => {
    addToCart(product, 1);
    openCart();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-200 flex flex-col h-full">
      {/* تصویر محصول */}
      <div className="scale-90 bg-gray-50 flex items-center justify-center flex-shrink-0 relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span className="text-gray-500 text-sm" style={{ display: product.image ? 'none' : 'flex' }}>
          تصویر {product.name}
        </span>
        
        {/* Badges */}
        {product.badges && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.badges.new && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                جدید
              </span>
            )}
            {product.badges.bestseller && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                پرفروش
              </span>
            )}
            {product.badges.discount && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
                تخفیف
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        {/* نام محصول */}
        <h3 className="text-md font-bold text-gray-800 mb-3 text-center min-h-[3rem] flex items-center justify-center leading-tight">
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
          <div className="flex gap-2">
            <Button 
              onClick={handleAdd}
              variant="primary"
              size="sm"
              className="flex-1 text-xs px-2"
              icon={ShoppingCartIcon}
            >
              افزودن به سبد خرید
            </Button>
            <Link 
              to={`/product/${brandSlugForRoute}/${product.id}`}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-all duration-200 border border-gray-200 hover:border-gray-300 font-semibold text-sm"
            >
              <InfoIcon className="w-4 h-4" />
              مشخصات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
