import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatPrice } from '../../lib/utils';

const FeaturedProducts = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "لنت جلو سایپا 131 - نسخه جدید",
      price: "520,000",
      originalPrice: "650,000",
      discount: "20%",
      image: "/saipa.png",
      isNew: true,
      isFeatured: true,
      rating: 4.8,
      reviews: 45,
      badge: "جدید"
    },
    {
      id: 2,
      name: "لنت عقب پژو 206 - کیفیت برتر",
      price: "480,000",
      originalPrice: "580,000",
      discount: "17%",
      image: "/peugeot.png",
      isNew: false,
      isFeatured: true,
      rating: 4.6,
      reviews: 32,
      badge: "پرفروش"
    },
    {
      id: 3,
      name: "لنت جلو تویوتا کمری - نسخه 2024",
      price: "780,000",
      originalPrice: "780,000",
      discount: "0%",
      image: "/toyota.png",
      isNew: true,
      isFeatured: true,
      rating: 4.9,
      reviews: 67,
      badge: "جدید"
    },
    {
      id: 4,
      name: "لنت عقب هیوندای آوانته - سری جدید",
      price: "520,000",
      originalPrice: "620,000",
      discount: "16%",
      image: "/hyun.png",
      isNew: false,
      isFeatured: true,
      rating: 4.5,
      reviews: 28,
      badge: "تخفیف"
    }
  ];

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">محصولات ویژه و جدید</h2>
          <p className="text-sm sm:text-base text-gray-600">بهترین و جدیدترین محصولات ما را از دست ندهید</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
              {/* تصویر محصول */}
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 sm:h-40 md:h-48 object-contain p-3 sm:p-4 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white ${
                    product.badge === "جدید" ? "bg-green-500" :
                    product.badge === "پرفروش" ? "bg-orange-500" :
                    "bg-red-500"
                  }`}>
                    {product.badge}
                  </span>
                </div>
                
                {/* دکمه‌های عملیات */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors flex items-center justify-center">
                    <FavoriteIcon className="text-gray-600 text-xs sm:text-sm" />
                  </button>
                  <button className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center">
                    <VisibilityIcon className="text-gray-600 text-xs sm:text-sm" />
                  </button>
                </div>
              </div>
              
              {/* محتوای محصول */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm leading-tight group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                {/* امتیاز */}
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`text-xs sm:text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 mr-2">({product.reviews})</span>
                </div>
                
                {/* قیمت */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {product.discount !== "0%" ? (
                      <>
                        <span className="text-base sm:text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                      </>
                    ) : (
                      <span className="text-base sm:text-lg font-bold text-gray-800">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  {product.discount !== "0%" && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                      {product.discount} تخفیف
                    </span>
                  )}
                </div>
                
                {/* دکمه خرید */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold group-hover:shadow-lg text-sm sm:text-base">
                  <ShoppingCartIcon className="text-sm" />
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* دکمه مشاهده همه */}
        <div className="text-center mt-8 sm:mt-10">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base">
            مشاهده همه محصولات ویژه
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
