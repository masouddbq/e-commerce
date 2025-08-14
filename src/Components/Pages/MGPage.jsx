import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const MGPage = () => {
  const mgCars = [
    { id: 1, name: "لنت ترمز جلو MG 350 آفورتیس", price: "1,380,000", image: "/mg-350.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: MG 350, MG 550", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب MG 350 آفورتیس", price: "1,050,000", image: "/mg-350-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: MG 350, MG 550", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو MG ZS آفورتیس", price: "1,520,000", image: "/mg-zs.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: MG ZS, MG HS", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب MG ZS آفورتیس", price: "1,180,000", image: "/mg-zs-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: MG ZS, MG HS", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/mg.png" alt="MG" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت MG</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MG یکی از معتبرترین برندهای خودرو در جهان است که با بیش از 90 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی کلاسیک و تکنولوژی مدرن تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره MG</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت MG در سال 1924 در بریتانیا تأسیس شد و ابتدا در زمینه تولید خودروهای اسپرت فعالیت می‌کرد. 
                این شرکت با تولید خودروهای کلاسیک و زیبا، 
                شهرت جهانی در زمینه طراحی و کیفیت کسب کرد.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                MG در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای الکتریکی و هیبریدی تولید می‌کند. 
                این شرکت با ترکیب طراحی کلاسیک و تکنولوژی مدرن، 
                خودروهایی زیبا، ایمن و اقتصادی ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای MG</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {mgCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="mg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MGPage;
