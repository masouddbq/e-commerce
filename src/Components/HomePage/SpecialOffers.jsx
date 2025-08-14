import React from 'react';
import { Link } from 'react-router-dom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "تخفیف ویژه لنت جلو",
      subtitle: "سایپا و ایران خودرو",
      discount: "25%",
      originalPrice: "600,000",
      newPrice: "450,000",
      image: "/saipa.png",
      bgColor: "from-red-500 to-pink-500",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "پیشنهاد ویژه",
      subtitle: "لنت عقب پژو",
      discount: "30%",
      originalPrice: "480,000",
      newPrice: "336,000",
      image: "/peugeot.png",
      bgColor: "from-blue-500 to-purple-500",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "تخفیف آخر هفته",
      subtitle: "لنت تویوتا",
      discount: "20%",
      originalPrice: "750,000",
      newPrice: "600,000",
      image: "/toyota.png",
      bgColor: "from-green-500 to-teal-500",
      textColor: "text-white"
    }
  ];

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <LocalOfferIcon className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">تخفیف‌های ویژه</h2>
          <p className="text-gray-600">فرصت‌های طلایی خرید با بهترین قیمت‌ها</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className={`bg-gradient-to-br ${offer.bgColor} rounded-2xl p-6 ${offer.textColor} relative overflow-hidden`}>
              {/* Badge تخفیف */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-bold">
                {offer.discount} تخفیف
              </div>
              
              {/* محتوای اصلی */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                <p className="text-sm opacity-90">{offer.subtitle}</p>
              </div>
              
              {/* تصویر محصول */}
              <div className="flex justify-center mb-6">
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-20 h-20 object-contain"
                  />
                </div>
              </div>
              
              {/* قیمت‌ها */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl font-bold">{offer.newPrice}</span>
                  <span className="text-sm line-through opacity-75">{offer.originalPrice}</span>
                </div>
                <span className="text-sm opacity-90">تومان</span>
              </div>
              
              {/* دکمه خرید */}
              <button className="w-full bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 transition-all duration-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-2">
                خرید کنید
                <ArrowForwardIcon className="text-sm" />
              </button>
              
              {/* تایمر (اختیاری) */}
              <div className="mt-4 text-center">
                <p className="text-xs opacity-75">این پیشنهاد محدود است</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* بنر اضافی */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">عضویت در باشگاه مشتریان</h3>
          <p className="text-lg mb-6 opacity-90">
            با عضویت در باشگاه مشتریان ما، از تخفیف‌های ویژه و پیشنهادات منحصر به فرد باخبر شوید
          </p>
          <Link to="/club" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            عضویت رایگان
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
