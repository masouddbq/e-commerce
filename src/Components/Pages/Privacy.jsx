import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import BlockIcon from '@mui/icons-material/Block';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const Privacy = () => {
  useEffect(() => {
    document.title = 'حریم خصوصی | لنت شاپ';
  }, []);

  const sections = [
    {
      id: 1,
      icon: <SecurityIcon className="text-blue-600 text-4xl" />,
      title: "حفظ امنیت داده‌ها",
      description: "اطلاعات مشتریان در بستر امن ذخیره و محافظت می‌شود.",
      color: "blue"
    },
    {
      id: 2,
      icon: <BlockIcon className="text-red-600 text-4xl" />,
      title: "عدم استفاده غیرمجاز",
      description: "هیچ‌گاه اطلاعات شما برای تبلیغات یا اهداف غیرمرتبط استفاده نخواهد شد.",
      color: "red"
    },
    {
      id: 3,
      icon: <ShareIcon className="text-green-600 text-4xl" />,
      title: "اشتراک‌گذاری اطلاعات",
      description: "فقط در موارد ضروری (مثل شرکت حمل‌ونقل برای تحویل سفارش) اطلاعات موردنیاز در اختیار قرار می‌گیرد.",
      color: "green"
    },
    {
      id: 4,
      icon: <PersonIcon className="text-purple-600 text-4xl" />,
      title: "حق انتخاب مشتری",
      description: "مشتریان می‌توانند در هر زمان درخواست حذف یا ویرایش اطلاعات خود را به پشتیبانی اعلام کنند.",
      color: "purple"
    },
    {
      id: 5,
      icon: <PaymentIcon className="text-orange-600 text-4xl" />,
      title: "حفظ حریم خرید آنلاین",
      description: "کلیه تراکنش‌های بانکی از طریق درگاه‌های امن و معتبر بانکی انجام می‌شود و فروشگاه هیچ‌گونه دسترسی به اطلاعات کارت بانکی شما ندارد.",
      color: "orange"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <HomeIcon fontSize="small" />
                <span>خانه</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">حریم خصوصی</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-l from-purple-600 to-indigo-700 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <LockIcon className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              حریم خصوصی
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto">
              امنیت و حفظ حریم خصوصی اطلاعات شما برای ما در اولویت است
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <VerifiedUserIcon className="text-purple-600 text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  حریم خصوصی اطلاعات مشتریان
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  ما در فروشگاه <span className="font-bold text-blue-600">لنت شاپ</span> احترام ویژه‌ای برای اطلاعات شخصی مشتریان قائل هستیم.
                  اطلاعاتی مثل نام، شماره تماس، آدرس و جزئیات سفارش شما فقط برای پردازش و ارسال خرید استفاده می‌شود و به هیچ شخص یا سازمان دیگری واگذار نخواهد شد.
                </p>
              </div>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-${section.color}-500`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {section.id}. {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Data Collection Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <SecurityIcon className="text-blue-600 text-3xl" />
              اطلاعاتی که جمع‌آوری می‌کنیم
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">اطلاعات هویتی</h4>
                  <p className="text-gray-600">نام، نام خانوادگی، شماره تماس و ایمیل</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">اطلاعات آدرس</h4>
                  <p className="text-gray-600">آدرس پستی برای ارسال سفارشات</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">اطلاعات سفارش</h4>
                  <p className="text-gray-600">تاریخچه خریدها و سفارشات</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Measures */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <VerifiedUserIcon className="text-green-600 text-3xl" />
              اقدامات امنیتی ما
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">رمزنگاری داده‌ها</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">ذخیره‌سازی امن</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">دسترسی محدود</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">نظارت مستمر</span>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div className="bg-gradient-to-l from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border-r-4 border-purple-600 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <PersonIcon className="text-purple-600 text-3xl" />
              حقوق شما
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl">✓</span>
                <span className="text-gray-700">دسترسی به اطلاعات شخصی خود</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl">✓</span>
                <span className="text-gray-700">درخواست ویرایش اطلاعات</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl">✓</span>
                <span className="text-gray-700">درخواست حذف اطلاعات</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 text-xl">✓</span>
                <span className="text-gray-700">لغو اشتراک ایمیل‌های تبلیغاتی</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <LockIcon className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                سوالی در مورد حریم خصوصی دارید؟
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                اگر سوال یا نگرانی در مورد نحوه استفاده از اطلاعات شخصی‌تان دارید، با تیم پشتیبانی ما تماس بگیرید.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-l from-purple-600 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
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

export default Privacy;

