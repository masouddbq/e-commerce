import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const VolkswagenPage = () => {
  const volkswagenCars = [
    { id: 1, name: "لنت ترمز جلو فولکس‌واگن گلف آفورتیس", price: "1,380,000", image: "/volkswagen-golf.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: فولکس‌واگن گلف، پاسات", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب فولکس‌واگن گلف آفورتیس", price: "1,050,000", image: "/volkswagen-golf-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: فولکس‌واگن گلف، پاسات", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو فولکس‌واگن پاسات آفورتیس", price: "1,520,000", image: "/volkswagen-passat.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: فولکس‌واگن پاسات، آرته‌ئون", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب فولکس‌واگن پاسات آفورتیس", price: "1,180,000", image: "/volkswagen-passat-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: فولکس‌واگن پاسات، آرته‌ئون", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/volkswagen.png" alt="فولکس‌واگن" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت فولکس‌واگن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            فولکس‌واگن یکی از بزرگترین تولیدکنندگان خودرو در جهان است که با بیش از 80 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی مدرن و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره فولکس‌واگن</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت فولکس‌واگن در سال 1937 در آلمان تأسیس شد و ابتدا در زمینه تولید خودروهای مردمی فعالیت می‌کرد. 
                این شرکت با تولید خودروهای مشهور مانند گلف و پاسات، 
                شهرت جهانی در زمینه کیفیت و اطمینان کسب کرد.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                فولکس‌واگن در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای فولکس‌واگن</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {volkswagenCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="volkswagen"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolkswagenPage; 
