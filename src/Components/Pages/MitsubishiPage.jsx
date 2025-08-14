import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const MitsubishiPage = () => {
  const mitsubishiCars = [
    { id: 1, name: "لنت ترمز جلو میتسوبیشی اوتلندر آفورتیس", price: "1,400,000", image: "/mitsubishi-lancer.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ASX", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز جلو میتسوبیشی فوسو آفورتیس", price: "3,400,000", image: "/mitsubishi-lancer-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو میتسوبیشی لنسر 2014 آفورتیس", price: "1,400,000", image: "/mitsubishi-outlander.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ASX _ اوتلندر", stockStatus: "موجود" },
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
            <img src="/mitsubishi-logo.png" alt="میتسوبیشی" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت میتسوبیشی موتورز</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            شرکت میتسوبیشی موتورز یکی از قدیمی‌ترین تولیدکنندگان خودرو در ژاپن است که با بیش از 140 سال سابقه، 
            انواع خودروهای با کیفیت و تکنولوژی پیشرفته را تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره میتسوبیشی موتورز</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت میتسوبیشی موتورز در سال 1870 تأسیس شد و در ابتدا تولیدکننده کشتی بود. 
                این شرکت با تولید خودروهای مشهور مانند لنسر و پاجرو، 
                شهرت جهانی در زمینه خودروهای همه‌کاره کسب کرد.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                میتسوبیشی موتورز انواع خودروهای سواری، شاسی بلند و کراس اوور را تولید می‌کند. 
                این شرکت با تمرکز بر تکنولوژی چهارچرخ متحرک، طراحی مدرن و کیفیت بالا، 
                خودروهایی قابل اعتماد و همه‌کاره ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای میتسوبیشی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {mitsubishiCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="mitsubishi"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitsubishiPage; 
