import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const RenaultPage = () => {
  const renaultCars = [
    { id: 1, name: "لنت ترمز جلو رنو کولئوس آفورتیس", price: "1,580,000", image: "/renault-koleos.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو کولئوس، کپچر", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب رنو کولئوس آفورتیس", price: "1,180,000", image: "/renault-koleos-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو کولئوس، کپچر", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو رنو تالیسمان آفورتیس", price: "1,720,000", image: "/renault-talisman.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو تالیسمان، لاگونا", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب رنو تالیسمان آفورتیس", price: "1,280,000", image: "/renault-talisman-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو تالیسمان، لاگونا", stockStatus: "موجود" },
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
            <img src="/renault.png" alt="رنو" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت رنو</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            رنو یکی از بزرگترین تولیدکنندگان خودرو در فرانسه است که با بیش از 120 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی مدرن و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره رنو</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت رنو در سال 1899 در فرانسه تأسیس شد و ابتدا در زمینه تولید خودروهای لوکس فعالیت می‌کرد. 
                این شرکت با تولید خودروهای مشهور مانند کولئوس و تالیسمان، 
                شهرت جهانی در زمینه کیفیت و طراحی کسب کرد.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                رنو در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای رنو</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {renaultCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="renault"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenaultPage; 
