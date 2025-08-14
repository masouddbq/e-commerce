import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const NissanPage = () => {
  const nissanCars = [
    { id: 1, name: "لنت ترمز جلو نیسان ماکسیما آفورتیس ", price: "1,320,000", image: "/nissan-juke.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: تیانا", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب نیسان ماکسیما آفورتیس", price: "1,140,000", image: "/nissan-diesel.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو نیسان پاترول آفورتیس", price: "1,160,000", image: "/nissan-navara.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز جلو نیسان دیسکی دیزل آفورتیس ", price: "1,480,000", image: "/nissan-maxima.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: پادرا", stockStatus: "موجود" },
    { id: 5, name: "لنت ترمز عقب نیسان مورانو آفورتیس ", price: "950,000", image: "/nissan-altima.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: تیانا - سوزوکی ویتارا ـ هایما S5", stockStatus: "موجود" },
    { id: 6, name: "لنت ترمز جلو نیسان مورانو باریک آفورتیس ", price: "1,775,000", image: "/nissan-murano.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو کولئوس ۲۰۱۳-۲۰۱۵", stockStatus: "موجود" },
    { id: 7, name: "لنت ترمز جلو نیسان پیکاپ آفورتیس  ", price: "1,225,000", image: "/nissan-murano.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رونیز ـ سرانزا", stockStatus: "موجود" },
    { id: 8, name: "لنت ترمز جلو نیسان قشقایی آفورتیس   ", price: "1,430,000", image: "/nissan-murano.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: هایما S5", stockStatus: "موجود" },
    { id: 9, name: "لنت ترمز جلو نیسان ایکس تریل آفورتیس    ", price: "1,530,000", image: "/nissan-murano.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو تالیسمان", stockStatus: "موجود" },
    { id: 10, name: "لنت ترمز عقب نیسان ایکس تریل آفورتیس     ", price: "1,100,000", image: "/nissan-murano.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رنو تالیسمان", stockStatus: "موجود" },
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
            <img src="/nissan.png" alt="نیسان" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت نیسان</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نیسان یکی از بزرگترین تولیدکنندگان خودرو در جهان است که با بیش از 80 سال سابقه، 
            خودروهایی با کیفیت بالا، تکنولوژی پیشرفته و طراحی مدرن تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره نیسان</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت نیسان در سال 1933 در ژاپن تأسیس شد و ابتدا در زمینه تولید موتورسیکلت فعالیت می‌کرد. 
                اولین خودروی نیسان در سال 1934 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی جهان بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                نیسان در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای لوکس، خودروهای الکتریکی و خودروهای تجاری تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای نیسان</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            {nissanCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="nissan"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NissanPage;
