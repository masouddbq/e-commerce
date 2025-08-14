import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../Common/ProductCard';

const KiaPage = () => {
  const kiaCars = [
    { id: 1, name: "لنت ترمز جلو کیا سراتو سایپا مونتاژ آفورتیس", price: "1,420,000", image: "/kia-cerato.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای : هیوندای i30 - سراتو وارداتی ۲۰۱۰ تا ۲۰۱۳", stockStatus: "موجود" },
    { id: 2, name: "لنت ترمز عقب کیا سراتو مدل 2008 آفورتیس", price: "950,000", image: "/kia-cerato-rear.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای : آوانته - کوپه (fx) ", stockStatus: "موجود" },
    { id: 3, name: "لنت ترمز جلو کیا کادنزا آفورتیس", price: "1,400,000", image: "/kia-optima.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای : توسان (ix35) سوناتا ال اف - جک S5", stockStatus: "موجود" },
    { id: 4, name: "لنت ترمز عقب کیا اپیروس آفورتیس ", price: "و1,000,000", image: "/kia-picanto.jpg", brand: "آفورتیس", category: "دیسکی", suitableFor: "مناسب برای خودروهای : اپتیما - چانگان CS35 ـ ولستر", stockStatus: "موجود" },
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
            <img src="/kia.png" alt="کیا" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">شرکت کیا موتورز</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            شرکت کیا موتورز یکی از بزرگترین تولیدکنندگان خودرو در کره جنوبی است که با بیش از 75 سال سابقه، 
            انواع خودروهای با کیفیت و مدرن را تولید می‌کند.
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">درباره کیا موتورز</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">تاریخچه</h3>
              <p className="text-gray-700 leading-relaxed">
                شرکت کیا موتورز در سال 1944 تأسیس شد و در ابتدا تولیدکننده قطعات دوچرخه بود. 
                این شرکت با گذشت زمان به یکی از پیشگامان صنعت خودروسازی تبدیل شد و 
                امروزه در بیش از 180 کشور جهان حضور دارد.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">محصولات</h3>
              <p className="text-gray-700 leading-relaxed">
                کیا موتورز انواع خودروهای سواری، شاسی بلند، کراس اوور و الکتریکی را تولید می‌کند. 
                این شرکت با تمرکز بر طراحی مدرن، کیفیت بالا و تکنولوژی پیشرفته، 
                خودروهایی ایمن و اقتصادی ارائه می‌دهد.
              </p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خودروهای کیا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {kiaCars.map((car) => (
              <ProductCard 
                key={car.id} 
                product={car} 
                brandSlug="kia"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KiaPage;
