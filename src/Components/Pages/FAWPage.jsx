import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const FAWPage = () => {
  const fawCars = [
    { id: 1, name: "لنت ترمز جلو FAW V5 آفورتیس", price: "1,280,000", image: "/faw-v5.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: FAW V5, V7", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب FAW V5 آفورتیس", price: "950,000", image: "/faw-v5-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: FAW V5, V7", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو FAW X80 آفورتیس", price: "1,480,000", image: "/faw-x80.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: FAW X80, B50", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب FAW X80 آفورتیس", price: "1,180,000", image: "/faw-x80-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: FAW X80, B50", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/faw.png" alt="FAW" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت FAW</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            FAW یکی از بزرگترین تولیدکنندگان خودرو در چین است که با بیش از 60 سال سابقه، 
            خودروهایی با کیفیت بالا، قیمت مناسب و تکنولوژی مدرن تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره FAW</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت FAW در سال 1953 در چین تأسیس شد و ابتدا در زمینه تولید خودروهای تجاری فعالیت می‌کرد. 
                این شرکت با تولید خودروهای مشهور مانند V5 و X80، 
                شهرت جهانی در زمینه کیفیت و قیمت مناسب کسب کرد.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                FAW در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای FAW</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {fawCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="faw"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAWPage; 
