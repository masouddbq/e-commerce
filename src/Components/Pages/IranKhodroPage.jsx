import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const IranKhodroPage = () => {
  const irankhodroCars = [
    { id: 1, name: "لنت ترمز جلو ایران‌خودرو سمند آفورتیس", price: "1,180,000", image: "/irankhodro-samand.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ایران‌خودرو سمند، پژو 405", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب ایران‌خودرو سمند آفورتیس", price: "880,000", image: "/irankhodro-samand-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ایران‌خودرو سمند، پژو 405", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو ایران‌خودرو دنا آفورتیس", price: "1,280,000", image: "/irankhodro-dena.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ایران‌خودرو دنا، رانا", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب ایران‌خودرو دنا آفورتیس", price: "950,000", image: "/irankhodro-dena-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ایران‌خودرو دنا، رانا", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/irankhodro.png" alt="ایران‌خودرو" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت ایران‌خودرو</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ایران‌خودرو یکی از بزرگترین تولیدکنندگان خودرو در ایران است که با بیش از 50 سال سابقه، 
            خودروهایی با کیفیت بالا، قیمت مناسب و طراحی کاربردی تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره ایران‌خودرو</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت ایران‌خودرو در سال 1962 در ایران تأسیس شد و ابتدا در زمینه تولید خودروهای کوچک فعالیت می‌کرد. 
                این شرکت با تولید خودروهای مشهور مانند پیکان و سمند، 
                نقش مهمی در خودکفایی صنعت خودروسازی ایران ایفا کرده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                ایران‌خودرو در حال حاضر انواع خودروهای سواری، شاسی بلند و خودروهای تجاری تولید می‌کند. 
                این شرکت با تمرکز بر کیفیت، قیمت مناسب و مصرف سوخت بهینه، 
                خودروهایی اقتصادی و کاربردی ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای ایران‌خودرو</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {irankhodroCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="irankhodro"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IranKhodroPage; 
