import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import InventoryIcon from '@mui/icons-material/Inventory';

const Shipping = () => {
  useEffect(() => {
    document.title = 'شرایط ارسال | لنت شاپ';
  }, []);

  const shippingMethods = [
    {
      id: 1,
      icon: <LocalShippingIcon className="text-5xl text-blue-600" />,
      title: "ارسال پیک موتوری (مشهد)",
      time: "همان روز",
      cost: "رایگان",
      description: "برای سفارشات داخل شهر مشهد",
      features: [
        "ارسال در همان روز",
        "هزینه ارسال رایگان",
        "تحویل درب منزل"
      ],
      badge: "پیشنهاد ویژه"
    },
    {
      id: 2,
      icon: <InventoryIcon className="text-5xl text-green-600" />,
      title: "پست پیشتاز",
      time: "۲ تا ۴ روز کاری",
      cost: "متغیر",
      description: "ارسال به سراسر کشور",
      features: [
        "پیگیری آنلاین مرسوله",
        "بیمه محموله",
        "تحویل با پست"
      ],
      badge: null
    },
    {
      id: 3,
      icon: <TrackChangesIcon className="text-5xl text-orange-600" />,
      title: "باربری",
      time: "۳ تا ۷ روز کاری",
      cost: "متغیر",
      description: "برای سفارشات حجیم",
      features: [
        "مناسب بارهای سنگین",
        "ارسال به ترمینال شهر",
        "هزینه کمتر"
      ],
      badge: null
    }
  ];

  const shippingSteps = [
    {
      step: 1,
      title: "ثبت سفارش",
      description: "پس از ثبت و پرداخت سفارش"
    },
    {
      step: 2,
      title: "بسته‌بندی",
      description: "آماده‌سازی و بسته‌بندی محصول"
    },
    {
      step: 3,
      title: "ارسال",
      description: "تحویل به پست یا پیک"
    },
    {
      step: 4,
      title: "تحویل",
      description: "دریافت محصول توسط مشتری"
    }
  ];

  const shippingCities = [
    { city: "مشهد", time: "همان روز", cost: "رایگان" },
    { city: "تهران", time: "۲-۳ روز", cost: "۳۰,۰۰۰ تومان" },
    { city: "اصفهان", time: "۲-۳ روز", cost: "۳۵,۰۰۰ تومان" },
    { city: "شیراز", time: "۳-۴ روز", cost: "۴۰,۰۰۰ تومان" },
    { city: "تبریز", time: "۳-۴ روز", cost: "۴۰,۰۰۰ تومان" },
    { city: "سایر شهرها", time: "۳-۵ روز", cost: "متغیر" }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <HomeIcon fontSize="small" />
                <span>خانه</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">شرایط ارسال</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-l from-orange-600 to-red-600 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <LocalShippingIcon className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              شرایط ارسال
            </h1>
            <p className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto">
              ارسال سریع و مطمئن به سراسر کشور
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
                <LocalShippingIcon className="text-orange-600 text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  ارسال سریع و ایمن
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  ما متعهد هستیم سفارش شما را در سریع‌ترین زمان ممکن و با بسته‌بندی مناسب به دست شما برسانیم.
                  برای مشهدی‌ها ارسال رایگان و در همان روز!
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              روش‌های ارسال
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {method.badge && (
                    <div className="bg-gradient-to-l from-orange-600 to-red-600 text-white text-center py-2 text-sm font-bold">
                      {method.badge}
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex justify-center mb-6">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-center mb-4">
                      {method.description}
                    </p>
                    <div className="flex justify-center gap-6 mb-6">
                      <div className="text-center">
                        <AccessTimeIcon className="text-orange-600 mb-1" />
                        <p className="text-sm text-gray-600">{method.time}</p>
                      </div>
                      <div className="text-center">
                        <MonetizationOnIcon className="text-green-600 mb-1" />
                        <p className="text-sm text-gray-600">{method.cost}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircleIcon className="text-green-500 text-lg flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              فرآیند ارسال
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Cities */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              هزینه و مدت زمان ارسال به شهرهای مختلف
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingCities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-3">
                        {item.city}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AccessTimeIcon className="text-blue-600 text-sm" />
                          <span className="text-gray-700 text-sm">زمان: {item.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MonetizationOnIcon className="text-green-600 text-sm" />
                          <span className="text-gray-700 text-sm">هزینه: {item.cost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-r-4 border-orange-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="text-orange-600" />
                نکات مهم
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-gray-700">ارسال به مشهد در همان روز و رایگان</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-gray-700">بسته‌بندی استاندارد و مقاوم</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-gray-700">امکان پیگیری آنلاین مرسوله</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-r-4 border-blue-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrackChangesIcon className="text-blue-600" />
                پیگیری سفارش
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">کد پیگیری پس از ارسال پیامک می‌شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">امکان تماس با پشتیبانی</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">اطلاع‌رسانی در تمام مراحل</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <LocationOnIcon className="text-5xl text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                سوالی درباره ارسال دارید؟
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                برای اطلاعات بیشتر درباره شرایط ارسال یا پیگیری سفارش با ما تماس بگیرید.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-l from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;

