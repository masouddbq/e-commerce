import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPrice } from '../../lib/utils';
import { getDiscountedProducts } from '../../lib/supabase';
import { useCart } from '../Common/CartContext';
import { useAuth } from '../Common/AuthContext';

const SpecialOffers = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleMembershipClick = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/club');
    }
  };

  // استخراج رنگ اصلی از bgColor برای سایه (طیف آبی و سرمه‌ای)
  const extractShadowColor = (bgColor) => {
    if (bgColor.includes('indigo')) return 'rgba(79, 70, 229, 0.3)';
    if (bgColor.includes('blue')) return 'rgba(59, 130, 246, 0.3)';
    if (bgColor.includes('cyan')) return 'rgba(6, 182, 212, 0.3)';
    if (bgColor.includes('slate')) return 'rgba(71, 85, 105, 0.3)';
    if (bgColor.includes('sky')) return 'rgba(14, 165, 233, 0.3)';
    if (bgColor.includes('navy')) return 'rgba(30, 64, 175, 0.3)';
    return 'rgba(59, 130, 246, 0.3)';
  };

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real discounted products from database
        const discountedProducts = await getDiscountedProducts(3);
        
        if (discountedProducts && discountedProducts.length > 0) {
          setOffers(discountedProducts);
        } else {
          // Fallback to static data if no discounted products found
          const fallbackOffers = [
            {
              id: 1,
              title: "لنت ترمز جلو تویوتا کمری آفورتیس",
              subtitle: "تویوتا",
              discount: "12%",
              originalPrice: "1,800,000",
              newPrice: "1,580,000",
              image: "/WEBP/toyota.webp",
              bgColor: "from-blue-600 to-indigo-700",
              textColor: "text-white",
              targetLink: "/brands/toyota"
            },
            {
              id: 2,
              title: "لنت ترمز عقب تویوتا کمری آفورتیس",
              subtitle: "تویوتا",
              discount: "15%",
              originalPrice: "1,500,000",
              newPrice: "1,280,000",
              image: "/WEBP/toyota.webp",
              bgColor: "from-cyan-600 to-blue-700",
              textColor: "text-white",
              targetLink: "/brands/toyota"
            },
            {
              id: 3,
              title: "لنت ترمز جلو نیسان ماکسیما آفورتیس",
              subtitle: "نیسان",
              discount: "14%",
              originalPrice: "1,800,000",
              newPrice: "1,550,000",
              image: "/WEBP/nissan.webp",
              bgColor: "from-blue-600 to-indigo-700",
              textColor: "text-white",
              targetLink: "/brands/nissan"
            }
          ];
          setOffers(fallbackOffers);
        }
      } catch (err) {
        console.error('Error loading offers:', err);
        setError('خطا در بارگذاری پیشنهادات ویژه');
        
        // Fallback to static data on error
        const fallbackOffers = [
          {
            id: 1,
            title: "لنت ترمز جلو تویوتا کمری آفورتیس",
            subtitle: "تویوتا",
            discount: "12%",
            originalPrice: "1,800,000",
            newPrice: "1,580,000",
            image: "/WEBP/toyota.webp",
            bgColor: "from-blue-600 to-indigo-700",
            textColor: "text-white",
            targetLink: "/brands/toyota"
          },
          {
            id: 2,
            title: "لنت ترمز عقب تویوتا کمری آفورتیس",
            subtitle: "تویوتا",
            discount: "15%",
            originalPrice: "1,500,000",
            newPrice: "1,280,000",
            image: "/WEBP/toyota.webp",
            bgColor: "from-cyan-600 to-blue-700",
            textColor: "text-white",
            targetLink: "/brands/toyota"
          },
          {
            id: 3,
            title: "لنت ترمز جلو نیسان ماکسیما آفورتیس",
            subtitle: "نیسان",
            discount: "14%",
            originalPrice: "1,800,000",
            newPrice: "1,550,000",
            image: "/WEBP/nissan.webp",
            bgColor: "from-slate-700 to-slate-900",
            textColor: "text-white",
            targetLink: "/brands/nissan"
          }
        ];
        setOffers(fallbackOffers);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">پیشنهادات ویژه</h2>
            <p className="text-gray-600">در حال بارگذاری بهترین پیشنهادات...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-200 rounded-2xl p-3 sm:p-4 lg:p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">پیشنهادات ویژه</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">نمایش پیشنهادات پیش‌فرض</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تلاش مجدد
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {offers.map((offer, index) => {
              // رنگ ثابت آبی با گرادیانت
              const cardBgColor = offer.bgColor || 'from-blue-600 to-indigo-700';
              return (
              <div key={offer.id} className={`bg-gradient-to-br ${cardBgColor} rounded-2xl p-3 sm:p-4 lg:p-6 text-white relative overflow-hidden`}>
                {/* Badge تخفیف - بهبود یافته برای موبایل */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-red-600 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold shadow-lg">
                  {offer.discount} تخفیف
                </div>
                
                {/* محتوای اصلی - بهبود یافته برای موبایل */}
                <div className="text-center mb-3 sm:mb-4 lg:mb-6 pt-8 sm:pt-10">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 leading-tight">{offer.title}</h3>
                  <p className="text-xs sm:text-sm opacity-80">{offer.subtitle}</p>
                </div>
                
                {/* تصویر محصول */}
                <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                  <div className="bg-white bg-opacity-20 rounded-full p-1 sm:p-2 lg:p-3 flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="w-14 h-14 sm:w-18 sm:h-18 lg:w-22 lg:h-22 object-contain drop-shadow-md"
                      onError={(e) => {
                        // در صورت خطا در بارگذاری تصویر، از لوگوی برند استفاده می‌کنیم
                        const brandMap = {
                          'تویوتا': 'toyota',
                          'هیوندای': 'hyun',
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
                          'ایران خودرو': 'irankhodro',
                          'فاو': 'faw',
                          'جی‌ای‌سی': 'jac',
                          'جک': 'jac',
                          'زانتیا': 'renault',
                          'بی‌ام‌دبلیو': 'bmw'
                        };
                        const imageName = brandMap[offer.subtitle] || offer.subtitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        e.target.src = `/WEBP/${imageName}.webp`;
                      }}
                    />
                  </div>
                </div>
                
                {/* قیمت‌ها */}
                <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 mb-1 sm:mb-2">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold">{formatPrice(offer.newPrice)}</span>
                    <span className="text-xs sm:text-sm line-through opacity-75">{formatPrice(offer.originalPrice)}</span>
                  </div>
                  <span className="text-xs sm:text-sm opacity-90">تومان</span>
                </div>
                
                {/* دکمه خرید */}
                <Link to={offer.targetLink} className="w-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 transition-all duration-300 rounded-lg py-2 sm:py-2.5 lg:py-3 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base">
                  <span className="hidden sm:inline">خرید کنید</span>
                  <span className="sm:hidden">خرید</span>
                  <ArrowForwardIcon className="text-xs sm:text-sm" />
                </Link>
                
                {/* تایمر (اختیاری) */}
                <div className="mt-2 sm:mt-3 lg:mt-4 text-center">
                  <p className="text-[10px] sm:text-xs opacity-75">این پیشنهاد محدود است</p>
                  {offer.stockStatus && (
                    <div className="mt-1">
                      <span className={`text-[10px] px-2 py-1 rounded-full ${
                        offer.stockStatus === 'موجود' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {offer.stockStatus}
                      </span>
                      {offer.stockCount && offer.stockStatus === 'موجود' && (
                        <span className="text-[10px] text-white opacity-75 block mt-1">
                          موجودی: {offer.stockCount} عدد
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
        </div>
        {/* موبایل: اسکرول افقی */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {offers.map((offer, index) => {
              // رنگ ثابت آبی با گرادیانت
              const cardBgColor = offer.bgColor || 'from-blue-600 to-indigo-700';
              return (
              <div
                key={offer.id}
                className="flex-shrink-0 w-64"
                style={{ boxShadow: `0 25px 50px -12px ${extractShadowColor(cardBgColor)}` }}
              >
                <Link 
                  to={`/product/${offer.id}`} 
                  className={`bg-gradient-to-br ${cardBgColor} rounded-2xl p-2.5 sm:p-3 text-white relative overflow-hidden min-h-[420px] flex flex-col hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
              {/* Badge تخفیف - شیشه‌ای شفاف */}
              <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-2 py-1 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-bold shadow-lg z-10">
                {offer.discount} تخفیف
              </div>
              
              {/* محتوای اصلی - بهبود یافته برای موبایل */}
              <div className="text-center pt-6 sm:pt-8 mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-bold mb-1 sm:mb-2 leading-tight line-clamp-2">{offer.title}</h3>
                <p className="text-xs sm:text-sm opacity-90">{offer.subtitle}</p>
              </div>
              
              {/* فضای خالی برای تراز قیمت‌ها */}
              <div className="flex-1"></div>
              
              {/* قیمت‌ها */}
              <div className="text-center mb-2 sm:mb-3">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <span className="text-lg sm:text-xl font-bold">{formatPrice(offer.newPrice)}</span>
                  <span className="text-xs font-bold sm:text-sm line-through opacity-50">{formatPrice(offer.originalPrice)}</span>
                </div>
                <span className="text-xs sm:text-sm opacity-90">تومان</span>
              </div>
              
              {/* فضای خالی برای align کردن دکمه‌ها */}
              <div className="flex-1"></div>
              
              {/* دکمه افزودن به سبد خرید */}
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  addToCart({
                    id: offer.id,
                    name: offer.title,
                    price: offer.newPrice,
                    image: offer.image,
                    brand: offer.subtitle
                  }); 
                }}
                className="w-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 transition-all duration-300 rounded-lg py-1.5 sm:py-2 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">افزودن به سبد خرید</span>
                <span className="sm:hidden">افزودن</span>
                <ShoppingCartIcon className="text-xs sm:text-sm" />
              </button>
              
              {/* تایمر (اختیاری) */}
              <div className="mt-1.5 sm:mt-2 text-center">
                <p className="text-[10px] sm:text-xs opacity-75">این پیشنهاد محدود است</p>
                {offer.stockStatus && (
                  <div className="mt-1">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${
                      offer.stockStatus === 'موجود' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {offer.stockStatus}
                    </span>
                    {offer.stockCount && offer.stockStatus === 'موجود' && (
                      <span className="text-[10px] text-white opacity-75 block mt-1">
                        موجودی: {offer.stockCount} عدد
                      </span>
                    )}
                  </div>
                )}
              </div>
              </Link>
            </div>
            );
            })}
        </div>
        
        {/* دسکتاپ: گرید */}
        <div className="hidden md:grid md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {offers.map((offer, index) => {
            // رنگ ثابت آبی با گرادیانت
            const cardBgColor = offer.bgColor || 'from-blue-600 to-indigo-700';
            return (
            <div
              key={offer.id}
              style={{ boxShadow: `0 25px 50px -12px ${extractShadowColor(cardBgColor)}` }}
            >
              <Link 
                to={`/product/${offer.id}`} 
                className={`bg-gradient-to-br ${cardBgColor} rounded-2xl p-2.5 sm:p-3 lg:p-4 text-white relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer min-h-[400px] flex flex-col`}
              >
              {/* Badge تخفیف - شیشه‌ای شفاف */}
              <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-2 py-1 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-bold shadow-lg z-10">
                {offer.discount} تخفیف
              </div>
              
              {/* محتوای اصلی - بهبود یافته برای دسکتاپ */}
              <div className="text-center pt-6 sm:pt-8 mb-2 sm:mb-3 lg:mb-4">
                <h3 className="text-xs sm:text-sm lg:text-base font-bold mb-1 sm:mb-2 leading-tight line-clamp-2">{offer.title}</h3>
                <p className="text-xs sm:text-sm opacity-90">{offer.subtitle}</p>
              </div>
              
              {/* فضای خالی برای تراز قیمت‌ها */}
              <div className="flex-1"></div>
              
              {/* قیمت‌ها */}
              <div className="text-center mb-2 sm:mb-3 lg:mb-4">
                <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 mb-1">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold">{formatPrice(offer.newPrice)}</span>
                  <span className="text-xs sm:text-sm line-through opacity-75">{formatPrice(offer.originalPrice)}</span>
                </div>
                <span className="text-xs sm:text-sm opacity-90">تومان</span>
              </div>
              
              {/* فضای خالی برای align کردن دکمه‌ها */}
              <div className="flex-1"></div>
              
              {/* دکمه افزودن به سبد خرید */}
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  addToCart({
                    id: offer.id,
                    name: offer.title,
                    price: offer.newPrice,
                    image: offer.image,
                    brand: offer.subtitle
                  }); 
                }}
                className="w-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 transition-all duration-300 rounded-lg py-1.5 sm:py-2 lg:py-2.5 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base"
              >
                <span className="hidden sm:inline">افزودن به سبد خرید</span>
                <span className="sm:hidden">افزودن</span>
                <ShoppingCartIcon className="text-xs sm:text-sm lg:text-base" />
              </button>
              
              {/* تایمر (اختیاری) */}
              <div className="mt-1.5 sm:mt-2 lg:mt-3 text-center">
                <p className="text-[10px] sm:text-xs opacity-75">این پیشنهاد محدود است</p>
                {offer.stockStatus && (
                  <div className="mt-1">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${
                      offer.stockStatus === 'موجود' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {offer.stockStatus}
                    </span>
                    {offer.stockCount && offer.stockStatus === 'موجود' && (
                      <span className="text-[10px] text-white opacity-75 block mt-1">
                        موجودی: {offer.stockCount} عدد
                      </span>
                    )}
                  </div>
                )}
              </div>
              </Link>
            </div>
            );
            })}
        </div>
        
        {/* بنر اضافی */}
        <div className="mt-8 sm:mt-10 lg:mt-12 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 text-white text-center shadow-2xl">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">عضویت در باشگاه مشتریان</h3>
          <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-5 lg:mb-6 opacity-90">
            با عضویت در باشگاه مشتریان ما، از تخفیف‌های ویژه و پیشنهادات منحصر به فرد باخبر شوید
          </p>
          <button 
            onClick={handleMembershipClick}
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 inline-block text-sm sm:text-base"
          >
            عضویت رایگان
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
