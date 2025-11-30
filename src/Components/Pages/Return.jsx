import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';

const Return = () => {
  useEffect(() => {
    document.title = 'بازگشت کالا | لنت شاپ';
  }, []);

  const returnConditions = [
    {
      id: 1,
      icon: <CheckCircleIcon className="text-green-600 text-4xl" />,
      title: "محصول معیوب یا ناقص",
      description: "در صورتی که محصول دارای عیب تولیدی یا ناقص باشد",
      accepted: true
    },
    {
      id: 2,
      icon: <CheckCircleIcon className="text-green-600 text-4xl" />,
      title: "عدم تطابق با سفارش",
      description: "اگر محصول ارسالی با سفارش شما مطابقت نداشته باشد",
      accepted: true
    },
    {
      id: 3,
      icon: <CheckCircleIcon className="text-green-600 text-4xl" />,
      title: "مهلت ۷ روزه",
      description: "بازگشت کالا تا ۷ روز پس از دریافت امکان‌پذیر است",
      accepted: true
    },
    {
      id: 4,
      icon: <CancelIcon className="text-red-600 text-4xl" />,
      title: "استفاده شده یا آسیب دیده",
      description: "کالاهایی که استفاده شده یا بسته‌بندی آنها آسیب دیده",
      accepted: false
    },
    {
      id: 5,
      icon: <CancelIcon className="text-red-600 text-4xl" />,
      title: "نصب شده",
      description: "کالاهایی که روی خودرو نصب شده‌اند",
      accepted: false
    },
    {
      id: 6,
      icon: <CancelIcon className="text-red-600 text-4xl" />,
      title: "گذشت از مهلت",
      description: "بازگشت کالا پس از ۷ روز امکان‌پذیر نیست",
      accepted: false
    }
  ];

  const returnSteps = [
    {
      step: 1,
      title: "تماس با پشتیبانی",
      description: "با شماره ۰۹۲۰۹۳۵۰۲۳۵ تماس بگیرید"
    },
    {
      step: 2,
      title: "بررسی درخواست",
      description: "تیم ما درخواست شما را بررسی می‌کند"
    },
    {
      step: 3,
      title: "ارسال کالا",
      description: "کالا را با بسته‌بندی اولیه ارسال کنید"
    },
    {
      step: 4,
      title: "بازرسی و تایید",
      description: "کالا بازرسی و در صورت تایید بازگشت وجه انجام می‌شود"
    },
    {
      step: 5,
      title: "بازگشت وجه",
      description: "وجه به حساب شما بازگردانده می‌شود"
    }
  ];

  const returnReasons = [
    { reason: "عیب تولیدی", accepted: true, refund: "کامل" },
    { reason: "عدم تطابق با سفارش", accepted: true, refund: "کامل" },
    { reason: "نقص فنی", accepted: true, refund: "کامل" },
    { reason: "آسیب در حمل و نقل", accepted: true, refund: "کامل" },
    { reason: "پشیمانی از خرید", accepted: true, refund: "با کسر هزینه ارسال" },
    { reason: "استفاده شده", accepted: false, refund: "ندارد" }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        {/* Breadcrumbs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <HomeIcon fontSize="small" />
                <span>خانه</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">بازگشت کالا</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-l from-red-600 to-pink-600 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AssignmentReturnIcon className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              بازگشت کالا
            </h1>
            <p className="text-lg sm:text-xl text-red-100 max-w-3xl mx-auto">
              ۷ روز ضمانت بازگشت کالا با شرایط ساده
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
                <VerifiedUserIcon className="text-red-600 text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  ضمانت بازگشت کالا
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  در فروشگاه لنت شاپ، رضایت شما برای ما مهم است. در صورت وجود هرگونه مشکل با محصول دریافتی، 
                  می‌توانید تا ۷ روز پس از دریافت، درخواست بازگشت یا تعویض کالا را ثبت کنید.
                </p>
                <div className="flex items-center gap-2 bg-red-50 p-4 rounded-xl">
                  <AccessTimeIcon className="text-red-600" />
                  <span className="text-gray-700 font-bold">مهلت: تا ۷ روز پس از دریافت کالا</span>
                </div>
              </div>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              شرایط بازگشت کالا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {returnConditions.map((condition) => (
                <div
                  key={condition.id}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-t-4 ${
                    condition.accepted ? 'border-green-500' : 'border-red-500'
                  } hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {condition.icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      {condition.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {condition.description}
                    </p>
                    <div className={`mt-4 px-4 py-2 rounded-full text-sm font-bold ${
                      condition.accepted 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {condition.accepted ? 'قابل بازگشت' : 'غیرقابل بازگشت'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return Steps */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              مراحل بازگشت کالا
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {returnSteps.map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-xs">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Return Reasons Table */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              دلایل مختلف بازگشت
            </h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-l from-red-600 to-pink-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-right">دلیل بازگشت</th>
                      <th className="px-6 py-4 text-center">وضعیت</th>
                      <th className="px-6 py-4 text-center">نوع بازپرداخت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {returnReasons.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-800 font-medium">{item.reason}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            item.accepted 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.accepted ? 'قابل قبول' : 'غیرقابل قبول'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">{item.refund}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-r-4 border-red-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <VerifiedUserIcon className="text-red-600" />
                شرایط لازم
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-gray-700">بسته‌بندی اصلی محصول سالم باشد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-gray-700">محصول استفاده نشده و در حالت اولیه باشد</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-gray-700">فاکتور و برگ گارانتی همراه محصول ارسال شود</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-gray-700">مهلت ۷ روزه رعایت شود</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-r-4 border-blue-600">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <LocalShippingIcon className="text-blue-600" />
                هزینه بازگشت
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">در صورت عیب یا اشتباه فروشگاه: رایگان</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">پشیمانی از خرید: هزینه ارسال با مشتری</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">بازگشت وجه: حداکثر ۷ روز کاری</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <PhoneIcon className="text-5xl text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                درخواست بازگشت کالا
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                برای ثبت درخواست بازگشت کالا با شماره زیر تماس بگیرید یا از طریق بخش تماس با ما پیام ارسال کنید.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-3 bg-red-50 px-6 py-3 rounded-xl">
                  <PhoneIcon className="text-red-600" />
                  <span className="text-xl font-bold text-gray-800">۰۹۲۰۹۳۵۰۲۳۵</span>
                </div>
                <Link
                  to="/contact"
                  className="inline-block bg-gradient-to-l from-red-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  تماس با پشتیبانی
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Return;

