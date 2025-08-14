import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const LexusPage = () => {
  const lexusCars = [
    { id: 1, name: "لنت ترمز جلو لکسوس ES350 آفورتیس", price: "2,100,000", image: "/lexus-es.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لکسوس ES350, ES250", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب لکسوس ES350 آفورتیس", price: "1,350,000", image: "/lexus-es-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لکسوس ES350, ES250", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو لکسوس RX350 آفورتیس", price: "2,300,000", image: "/lexus-rx.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لکسوس RX350, RX450h", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب لکسوس RX350 آفورتیس", price: "1,450,000", image: "/lexus-rx-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لکسوس RX350, RX450h", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/lexus.png" alt="لکسوس" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت لکسوس</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            لکسوس برند لوکس تویوتا است که با بیش از 30 سال سابقه، 
            خودروهایی با کیفیت فوق‌العاده، طراحی مدرن و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره لکسوس</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-purple-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                برند لکسوس در سال 1989 توسط تویوتا معرفی شد و ابتدا در بازار آمریکا عرضه شد. 
                این برند با تمرکز بر کیفیت، راحتی و لوکس بودن، 
                به یکی از معتبرترین برندهای خودرو در جهان تبدیل شده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                لکسوس انواع خودروهای لوکس، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این برند با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، راحت و با کیفیت فوق‌العاده ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای لکسوس</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {lexusCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="lexus"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LexusPage;
