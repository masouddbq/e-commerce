import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VerifiedIcon from '@mui/icons-material/Verified';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BuildIcon from '@mui/icons-material/Build';

const Guide = () => {
  useEffect(() => {
    document.title = 'راهنمای خرید | لنت شاپ';
  }, []);

  const sections = [
    {
      id: 1,
      icon: <VerifiedIcon className="text-green-600 text-4xl" />,
      title: "اصالت کالا",
      description: "تمام لنت‌های ترمز موجود در فروشگاه ما اصل، دارای گارانتی معتبر و مناسب خودروهای مشخص‌شده هستند.",
      color: "green"
    },
    {
      id: 2,
      icon: <PriceCheckIcon className="text-blue-600 text-4xl" />,
      title: "قیمت‌گذاری شفاف",
      description: "قیمت‌ها به‌روز بوده و شامل مالیات و هزینه‌های جانبی مشخص می‌باشند.",
      color: "blue"
    },
    {
      id: 3,
      icon: <PaymentIcon className="text-purple-600 text-4xl" />,
      title: "روش‌های پرداخت",
      description: "امکان پرداخت اینترنتی امن از طریق درگاه بانکی فراهم است.",
      color: "purple"
    },
    {
      id: 4,
      icon: <LocalShippingIcon className="text-orange-600 text-4xl" />,
      title: "ارسال و تحویل",
      description: "سفارش‌ها در سریع‌ترین زمان ممکن پردازش و ارسال می‌شوند. زمان تقریبی تحویل در صفحه هر محصول یا هنگام ثبت سفارش نمایش داده می‌شود.",
      color: "orange"
    },
    {
      id: 5,
      icon: <AttachMoneyIcon className="text-teal-600 text-4xl" />,
      title: "هزینه ارسال",
      description: "هزینه ارسال بسته به شهر و روش انتخابی محاسبه می‌شود. (ارسال در مشهد رایگان است)",
      color: "teal"
    },
    {
      id: 6,
      icon: <AssignmentReturnIcon className="text-red-600 text-4xl" />,
      title: "ضمانت بازگشت",
      description: "در صورت وجود ایراد یا مغایرت کالا با سفارش، مشتری تا ۷ روز حق تعویض یا بازگشت کالا را دارد.",
      color: "red"
    },
    {
      id: 7,
      icon: <SupportAgentIcon className="text-indigo-600 text-4xl" />,
      title: "پشتیبانی و خدمات پس از فروش",
      description: "تیم پشتیبانی ما در ساعات کاری آماده پاسخگویی به سوالات و راهنمایی شماست.",
      color: "indigo"
    },
    {
      id: 8,
      icon: <BuildIcon className="text-cyan-600 text-4xl" />,
      title: "مسئولیت نصب",
      description: "نصب لنت ترمز باید توسط تعمیرکار متخصص انجام شود. فروشگاه تنها مسئولیت اصالت و سلامت کالا را بر عهده دارد.",
      color: "cyan"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "جستجوی محصول",
      description: "خودرو یا برند مورد نظر خود را جستجو کنید"
    },
    {
      step: 2,
      title: "مشاهده جزئیات",
      description: "مشخصات فنی و قیمت محصول را بررسی کنید"
    },
    {
      step: 3,
      title: "افزودن به سبد",
      description: "محصول مورد نظر را به سبد خرید اضافه کنید"
    },
    {
      step: 4,
      title: "تکمیل اطلاعات",
      description: "آدرس و اطلاعات تماس خود را وارد کنید"
    },
    {
      step: 5,
      title: "پرداخت",
      description: "از طریق درگاه امن بانکی پرداخت کنید"
    },
    {
      step: 6,
      title: "دریافت محصول",
      description: "محصول را در کوتاه‌ترین زمان دریافت کنید"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <HomeIcon fontSize="small" />
                <span>خانه</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">راهنمای خرید</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-l from-green-600 to-emerald-700 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <MenuBookIcon className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              راهنمای خرید
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto">
              قوانین و مقررات خرید از فروشگاه آنلاین لنت شاپ
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              قوانین خرید در فروشگاه ما
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              خرید از فروشگاه لنت شاپ بسیار ساده و امن است. در ادامه با قوانین و مراحل خرید آشنا شوید.
            </p>
          </div>

          {/* Purchase Rules Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              قوانین و ضوابط خرید
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-b-4"
                  style={{
                    borderTopColor: `var(--${section.color}-600)`,
                    borderBottomColor: `var(--${section.color}-200)`
                  }}
                >
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="mb-4">
                      {section.icon}
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                      {section.id}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      {section.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Steps */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              مراحل خرید از لنت شاپ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((item, index) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-50"></div>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-r-4 border-green-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <VerifiedIcon className="text-green-600" />
                نکات مهم
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">همه محصولات دارای گارانتی اصالت هستند</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">ارسال رایگان در مشهد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">۷ روز ضمانت بازگشت کالا</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-r-4 border-blue-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SupportAgentIcon className="text-blue-600" />
                پشتیبانی
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">پاسخگویی در ساعات کاری</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">مشاوره رایگان قبل از خرید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">پیگیری سفارش آنلاین</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <MenuBookIcon className="text-5xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                آیا سوالی دارید؟
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                تیم پشتیبانی ما آماده است تا در تمام مراحل خرید شما را راهنمایی کند.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-block bg-gradient-to-l from-green-600 to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  تماس با ما
                </Link>
                <Link
                  to="/"
                  className="inline-block bg-gradient-to-l from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  شروع خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guide;

