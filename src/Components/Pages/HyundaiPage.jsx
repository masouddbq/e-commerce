import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const HyundaiPage = () => {
  const hyundaiCars = [
    { id: 1, name: "لنت ترمز جلو هیوندا سانتافه 2400 - 3500 آفورتیس", price: "1,790,000", image: "/hyundai-avante.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای : سانتافه 2700 جنسیس سدان ـ  سورنتو ۲۰۱۰ - موهاوی", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب هیوندا سانتافه 2400 - 3500", price: "1,050,000", image: "/hyundai-accent.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جنسیس سدان ـ سورنتو ۲۰۱۰ - موهاوی", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز عقب هیوندا سانتافه ۲۷۰۰ آفورتیس ", price: "1,160,000", image: "/hyundai-i10.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: کایرون - کی ام سی T8 _ گک گونو G5", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز جلو هیوندا توسان ۲۰۱۶ - ۲۰۱۷ آفورتیس", price: "1,625,000", image: "/hyundai-i20.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 5, name: "لنت ترمز جلو هیوندا سوناتا 2011 (YF) آفورتیس", price: "1,335,000", image: "/hyundai-tucson.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: چانگان ایدو", stockStatus: "موجود" },
    { id: 6, name: "لنت ترمز عقب هیوندا سوناتا 2011(YF) آفورتیس ", price: "1,000,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جک S5 دستی ـ سراتو ـ توسان (ix35)", stockStatus: "موجود" },
    { id: 7, name: "لنت ترمز جلو ورنا آفورتیس ", price: "1,150,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای : اکسنت - جک j3", stockStatus: "موجود" },
    { id: 8, name: "لنت ترمز جلو i20 وارداتی آفورتیس", price: "1,615,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: النترا - ولستر", stockStatus: "موجود" },
    { id: 9, name: "لنت ترمز جلو النترا آفورتیس", price: "1,615,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: ولستر ـ i20 ,وارداتی", stockStatus: "موجود" },
    { id: 10, name: "لنت ترمز جلو سوناتا آزرا آفورتیس ", price: "1,350,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: چانگان CS35 ـ اپیروس ـ اپتیما مدل ۲۰۱۰", stockStatus: "موجود" },
    { id: 11, name: "لنت ترمز عقب آزرا سوناتا ۲۰۰۶ آفورتیس", price: "1,020,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: تراجت -موسو - کوراندو", stockStatus: "موجود" },
    { id: 12, name: "لنت ترمز جلو هیوندا تراجت آفورتیس", price: "1,890,000", image: "/hyundai-santafe.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: اکتیون", stockStatus: "موجود" },
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
            <img src="/hyun.png" alt="هیوندای" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت هیوندای</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            هیوندای یکی از بزرگترین تولیدکنندگان خودرو در جهان است که با بیش از 50 سال سابقه، 
            خودروهایی با کیفیت بالا، طراحی مدرن و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره هیوندای</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت هیوندای در سال 1967 در کره جنوبی تأسیس شد و ابتدا در زمینه ساخت و ساز فعالیت می‌کرد. 
                اولین خودروی هیوندای در سال 1975 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی جهان بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                هیوندای در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای لوکس و خودروهای الکتریکی تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای هیوندای</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            {hyundaiCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="hyundai"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyundaiPage;
