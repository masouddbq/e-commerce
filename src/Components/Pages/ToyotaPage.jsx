import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const ToyotaPage = () => {
  const toyotaCars = [
    { id: 1, name: "لنت ترمز جلو تویوتا پرادو آفورتیس", price: "1,640,000", image: "/toyota-camry.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: اف جی کروز ـ فورچنر", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب تویوتا پرادو آفورتیس ", price: "1,100,000", image: "/toyota-corolla.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: اف جی کروز فورچنر", stockStatus: "موجود" },
    { id: 3, name: "جلو تویوتا رافور RAV4 آفورتیس", price: "1,400,000", image: "/toyota-prius.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای تویوتا پریوس و هیلوکس", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز کمری 2011 آریون آفورتیس", price: "1,500,000", image: "/toyota-hilux.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: جیلی شاسی بلند", stockStatus: "موجود" },
    { id: 5, name: "لنت ترمز جلو کمری 2007 آفورتیس ",price: "1,600,000", image: "/toyota-landcruiser.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لکسوس ES350 _ ES250", stockStatus: "موجود" },
    { id: 6, name: "لنت ترمز عقب کمری 2007 آفورتیس", price: "1,000,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: رافور ـ لکسوس ES350 _ ES250", stockStatus: "موجود" },
    { id: 7, name: "لنت ترمز جلو تویوتا کمری گرند 2005 آفورتیس", price: "1,400,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 8, name: "لنت ترمز عقب تویوتا کمری گرند ۲۰۰۵ آفورتیس", price: "860,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لیفان ۶۲۰ - جیلی GC6", stockStatus: "موجود" },
    { id: 9, name: "لنت ترمز جلو تویوتا کرولا 2008 آفورتیس ", price: "1,570,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 10, name: "لنت ترمز عقب تویوتا کرولا 2008 آفورتیس ", price: "1,000,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: آریو Z300 _ شاهین ـ X22", stockStatus: "موجود" },
    { id: 11, name: "لنت ترمز جلو تویوتا یاریس 2007 آفورتیس  ", price: "1,180,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لیفان X50 _ برلیانس H230 _ 220", stockStatus: "موجود" },
    { id: 12, name: "لنت ترمز جلو هایلوکس شاسی بلند مدل 2007 تا 2012 آفورتیس  ", price: "1,610,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 13, name: "لنت ترمز جلو هایلوکس شاسی کوتاه 2011 آفورتیس", price: "1,430,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
    { id: 14, name: "لنت ترمز جلو لکسوس Rx350 آفورتیس", price: "1,950,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای: لکسوس NX200 _ NX300", stockStatus: "موجود" },
    { id: 15, name: "لنت ترمز عقب لکسوس Rx350 مدل 2010 آفورتیس Rx350 آفورتیس", price: "1,150,000", image: "/toyota-rav4.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "", stockStatus: "موجود" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ArrowBackIcon className="text-gray-600" />
            </Link>
            <img src="/toyota.png" alt="تویوتا" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت تویوتا</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            تویوتا بزرگترین تولیدکننده خودرو در جهان است که با بیش از 80 سال سابقه، 
            خودروهایی با کیفیت بالا، قابلیت اطمینان و تکنولوژی پیشرفته تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره تویوتا</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت تویوتا در سال 1937 در ژاپن تأسیس شد و ابتدا در زمینه تولید ماشین‌آلات نساجی فعالیت می‌کرد. 
                اولین خودروی تویوتا در سال 1936 تولید شد و از آن زمان تاکنون، 
                این شرکت یکی از پیشگامان صنعت خودروسازی جهان بوده است.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                تویوتا در حال حاضر انواع خودروهای سواری، شاسی بلند، خودروهای لوکس، خودروهای الکتریکی، هیبریدی و خودروهای تجاری تولید می‌کند. 
                این شرکت با استفاده از تکنولوژی‌های پیشرفته، 
                خودروهایی ایمن، اقتصادی و سازگار با محیط زیست ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای تویوتا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            {toyotaCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="toyota"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToyotaPage;
