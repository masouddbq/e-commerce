import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Payment = () => {
  useEffect(() => {
    document.title = 'شیوه‌های پرداخت | لنت شاپ';
  }, []);

  const paymentMethods = [
    {
      id: 1,
      icon: <CreditCardIcon className="text-4xl text-blue-600" />,
      title: "پرداخت آنلاین",
      description: "پرداخت از طریق تمامی کارت‌های عضو شتاب",
      features: [
        "پرداخت سریع و آسان",
        "تایید لحظه‌ای سفارش",
        "امکان پرداخت با تمام کارت‌ها"
      ],
      badge: "محبوب‌ترین"
    },
    {
      id: 2,
      icon: <AccountBalanceIcon className="text-4xl text-green-600" />,
      title: "کارت به کارت",
      description: "انتقال وجه مستقیم به حساب فروشگاه",
      features: [
        "بدون نیاز به درگاه بانکی",
        "واریز سریع",
        "ارسال رسید برای تایید"
      ],
      badge: null
    }
  ];

  const securityFeatures = [
    {
      icon: <LockIcon className="text-blue-600 text-3xl" />,
      title: "رمزنگاری SSL",
      description: "تمام اطلاعات با پروتکل SSL رمزنگاری می‌شوند"
    },
    {
      icon: <VerifiedUserIcon className="text-green-600 text-3xl" />,
      title: "تایید بانکی",
      description: "پرداخت از طریق درگاه‌های معتبر بانکی"
    },
    {
      icon: <SecurityIcon className="text-orange-600 text-3xl" />,
      title: "حفظ حریم خصوصی",
      description: "عدم ذخیره اطلاعات کارت بانکی"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "تکمیل سبد خرید",
      description: "محصولات مورد نظر را انتخاب و به سبد اضافه کنید"
    },
    {
      step: 2,
      title: "وارد کردن اطلاعات",
      description: "اطلاعات تماس و آدرس را وارد نمایید"
    },
    {
      step: 3,
      title: "انتخاب روش پرداخت",
      description: "یکی از روش‌های پرداخت را انتخاب کنید"
    },
    {
      step: 4,
      title: "پرداخت",
      description: "پرداخت را انجام دهید و رسید دریافت کنید"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <HomeIcon fontSize="small" />
                <span>خانه</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">شیوه‌های پرداخت</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <PaymentIcon className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              شیوه‌های پرداخت
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              پرداخت آسان، سریع و امن با روش‌های مختلف
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Payment Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              روش‌های پرداخت
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-blue-500"
                >
                  {method.badge && (
                    <div className="bg-gradient-to-l from-blue-600 to-blue-700 text-white text-center py-2 text-sm font-bold">
                      {method.badge}
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex justify-center mb-6">
                      {method.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      {method.description}
                    </p>
                    <div className="space-y-3">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <CheckCircleIcon className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              مراحل پرداخت
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
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

          {/* Security Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              امنیت پرداخت
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {securityFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-r-4 border-blue-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="text-blue-600" />
                نکات مهم
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">پرداخت از تمام کارت‌های عضو شبکه شتاب امکان‌پذیر است</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">اطلاعات کارت بانکی شما ذخیره نمی‌شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">در صورت کسر وجه و عدم ثبت سفارش، مبلغ حداکثر ۷۲ ساعت به حساب شما بازمی‌گردد</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-r-4 border-green-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SecurityIcon className="text-green-600" />
                امنیت تراکنش
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">استفاده از درگاه‌های معتبر بانکی</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">رمزنگاری اطلاعات با پروتکل SSL</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">دریافت رسید دیجیتال پس از پرداخت</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <PaymentIcon className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                مشکلی در پرداخت دارید؟
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                تیم پشتیبانی ما آماده است تا در فرآیند پرداخت شما را راهنمایی کند.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-l from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                تماس با پشتیبانی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;

