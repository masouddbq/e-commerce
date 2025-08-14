import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const GeelyPage = () => {
  const geelyCars = [
    { id: 1, name: "لنت ترمز جلو جیلی EC7 آفورتیس", price: "1,380,000", image: "/geely-ec7.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جیلی EC7, EC8", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب جیلی EC7 آفورتیس", price: "1,050,000", image: "/geely-ec7-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جیلی EC7, EC8", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو جیلی GC6 آفورتیس", price: "1,480,000", image: "/geely-gc6.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جیلی GC6, GC7", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب جیلی GC6 آفورتیس", price: "1,180,000", image: "/geely-gc6-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جیلی GC6, GC7", stockStatus: "موجود" },
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
            <img src="/geely.png" alt="جیلی" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت جیلی</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            جیلی یکی از معتبرترین تولیدکنندگان خودرو در چین است که با بیش از 30 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی مدرن و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره جیلی</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت جیلی در سال 1986 در چین تأسیس شد و ابتدا در زمینه تولید موتورسیکلت فعالیت می‌کرد. 
                اولین خودروی جیلی در سال 1998 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی چین بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                جیلی در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای جیلی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {geelyCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="geely"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeelyPage; 
