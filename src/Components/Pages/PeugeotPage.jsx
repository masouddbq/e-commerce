import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const PeugeotPage = () => {
  const peugeotCars = [
    { id: 1, name: "لنت ترمز جلو پژو 206 آفورتیس", price: "1,180,000", image: "/peugeot-206.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: پژو 206, 207", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب پژو 206 آفورتیس", price: "880,000", image: "/peugeot-206-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: پژو 206, 207", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو پژو 405 آفورتیس", price: "1,280,000", image: "/peugeot-405.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: پژو 405, 406", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب پژو 405 آفورتیس", price: "950,000", image: "/peugeot-405-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: پژو 405, 406", stockStatus: "موجود" },
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
            <img src="/peugeot.png" alt="پژو" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت پژو</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            پژو یکی از قدیمی‌ترین تولیدکنندگان خودرو در فرانسه است که با بیش از 130 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی زیبا و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره پژو</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت پژو در سال 1810 در فرانسه تأسیس شد و ابتدا در زمینه تولید ابزارهای ماشینی فعالیت می‌کرد. 
                اولین خودروی پژو در سال 1889 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی جهان بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                پژو در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای پژو</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {peugeotCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="peugeot"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeugeotPage; 
