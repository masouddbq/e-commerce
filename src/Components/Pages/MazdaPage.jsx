import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const MazdaPage = () => {
  const mazdaCars = [
    { id: 1, name: "لنت ترمز جلو مزدا 3 آفورتیس", price: "1,450,000", image: "/mazda-3.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: مزدا 3, مزدا 6", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب مزدا 3 آفورتیس", price: "1,100,000", image: "/mazda-3-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: مزدا 3, مزدا 6", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو مزدا CX-5 آفورتیس", price: "1,650,000", image: "/mazda-cx5.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: مزدا CX-5, CX-9", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب مزدا CX-5 آفورتیس", price: "1,200,000", image: "/mazda-cx5-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: مزدا CX-5, CX-9", stockStatus: "موجود" },
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
            <img src="/mazda.png" alt="مزدا" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت مزدا</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مزدا یکی از معتبرترین تولیدکنندگان خودرو در ژاپن است که با بیش از 100 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی زیبا و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره مزدا</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت مزدا در سال 1920 در ژاپن تأسیس شد و ابتدا در زمینه تولید ابزارهای ماشینی فعالیت می‌کرد. 
                اولین خودروی مزدا در سال 1931 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی جهان بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                مزدا در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای مزدا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {mazdaCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="mazda"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazdaPage;
