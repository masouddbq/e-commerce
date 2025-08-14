import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const SuzukiPage = () => {
  const suzukiCars = [
    { id: 1, name: "لنت ترمز جلو سوزوکی ویتارا آفورتیس", price: "1,280,000", image: "/suzuki-vitara.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: سوزوکی ویتارا، گرند ویتارا", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب سوزوکی ویتارا آفورتیس", price: "950,000", image: "/suzuki-vitara-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: سوزوکی ویتارا، گرند ویتارا", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو سوزوکی اسویفت آفورتیس", price: "1,150,000", image: "/suzuki-swift.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: سوزوکی اسویفت، بالینو", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب سوزوکی اسویفت آفورتیس", price: "880,000", image: "/suzuki-swift-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: سوزوکی اسویفت، بالینو", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/suzuki.png" alt="سوزوکی" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت سوزوکی</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            سوزوکی یکی از معتبرترین تولیدکنندگان خودرو در ژاپن است که با بیش از 100 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی مدرن و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره سوزوکی</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت سوزوکی در سال 1909 در ژاپن تأسیس شد و ابتدا در زمینه تولید ماشین‌آلات نساجی فعالیت می‌کرد. 
                اولین خودروی سوزوکی در سال 1937 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی جهان بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                سوزوکی در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای سوزوکی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {suzukiCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="suzuki"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuzukiPage; 
