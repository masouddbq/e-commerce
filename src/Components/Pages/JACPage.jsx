import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const JACPage = () => {
  const jacCars = [
    { id: 1, name: "لنت ترمز جلو جک J5 آفورتیس", price: "1,350,000", image: "/jac-s5-front.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب جک J5 آفورتیس ", price: "1,000,000", image: "/jac-s5-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز عقب جک KMC T8 مدل اختصاصی آفورتیس", price: "1,380,000", image: "/jac-s3-front.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز جلو جک KMC K7 آفورتیس", price: "1,950,000", image: "/jac-s3-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 5, name: "لنت ترمز جلو جک KMC J7 آفورتیس", price: "1,560,000", image: "/jac-j7-front.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: KMC X5", stockStatus: "موجود" },
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
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">JAC</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت JAC</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            شرکت JAC (Jianghuai Automobile Co.) یکی از بزرگترین تولیدکنندگان خودرو در چین است که 
            با کیفیت بالا و قیمت مناسب، خودروهای متنوعی را به بازار عرضه می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره JAC</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت JAC در سال 1964 تأسیس شد و در ابتدا در زمینه تولید کامیون فعالیت داشت. 
                این شرکت با گذشت زمان، به یکی از پیشگامان صنعت خودروسازی چین تبدیل شد و 
                انواع خودروهای سواری، شاسی بلند و تجاری را تولید می‌کند.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                JAC در حال حاضر انواع خودروهای مدرن و با کیفیت را تولید می‌کند که شامل 
                خودروهای سواری، شاسی بلند و تجاری می‌باشد. این شرکت با استفاده از 
                تکنولوژی‌های پیشرفته، خودروهایی ایمن و اقتصادی ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای JAC</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            {jacCars.map((car) => (
              <ProductCard key={car.id} product={car} brandSlug="jac" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JACPage;
