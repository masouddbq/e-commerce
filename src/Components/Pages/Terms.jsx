import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import CopyrightIcon from '@mui/icons-material/Copyright';
import SecurityIcon from '@mui/icons-material/Security';
import BalanceIcon from '@mui/icons-material/Balance';
import UpdateIcon from '@mui/icons-material/Update';

const Terms = () => {
  useEffect(() => {
    document.title = 'قوانین و مقررات | لنت شاپ';
  }, []);

  const sections = [
    {
      id: 1,
      icon: <CheckCircleIcon className="text-blue-600 text-3xl" />,
      title: "قبول شرایط",
      content: [
        "با ورود و استفاده از سایت، کاربر موافقت خود را با تمامی قوانین و مقررات زیر اعلام می‌کند."
      ]
    },
    {
      id: 2,
      icon: <SecurityIcon className="text-green-600 text-3xl" />,
      title: "استفاده مجاز",
      content: [
        "استفاده از سایت فقط برای خرید و مشاهده محصولات مجاز است.",
        "هرگونه استفاده غیرقانونی یا سوءاستفاده از خدمات سایت ممنوع می‌باشد."
      ]
    },
    {
      id: 3,
      icon: <BlockIcon className="text-red-600 text-3xl" />,
      title: "محدودیت‌های استفاده",
      content: [
        "کاربر حق ندارد سایت را برای مقاصد غیرمجاز یا آسیب‌رسان استفاده کند.",
        "هرگونه تلاش برای دسترسی غیرمجاز به سرور یا اطلاعات دیگران ممنوع است."
      ]
    },
    {
      id: 4,
      icon: <PersonIcon className="text-purple-600 text-3xl" />,
      title: "محتوای کاربران",
      content: [
        "نظرات و محتوای ارسالی توسط کاربران باید محترمانه، قانونی و بدون محتوای توهین‌آمیز یا خلاف قوانین باشد.",
        "مسئولیت کامل محتوای ارسالی بر عهده خود کاربر است."
      ]
    },
    {
      id: 5,
      icon: <CopyrightIcon className="text-orange-600 text-3xl" />,
      title: "مالکیت معنوی",
      content: [
        "تمامی محتوا، تصاویر و اطلاعات موجود در سایت متعلق به فروشگاه بوده و هرگونه کپی‌برداری بدون اجازه کتبی ممنوع است.",
        "کاربران تنها مجاز به استفاده شخصی و غیرتجاری از محتوای سایت هستند."
      ]
    },
    {
      id: 6,
      icon: <GavelIcon className="text-indigo-600 text-3xl" />,
      title: "مسئولیت‌ها",
      content: [
        "فروشگاه مسئولیتی در قبال خسارات ناشی از استفاده نادرست کاربر از محصولات یا سایت ندارد.",
        "مسئولیت صحت اطلاعات واردشده (مثل آدرس و شماره تماس) بر عهده کاربر است."
      ]
    },
    {
      id: 7,
      icon: <UpdateIcon className="text-teal-600 text-3xl" />,
      title: "تغییرات قوانین",
      content: [
        "فروشگاه حق تغییر یا بروزرسانی قوانین را دارد.",
        "تغییرات از طریق همین صفحه اطلاع‌رسانی خواهد شد و استفاده ادامه‌دار از سایت به منزله پذیرش تغییرات است."
      ]
    },
    {
      id: 8,
      icon: <BalanceIcon className="text-cyan-600 text-3xl" />,
      title: "قانون حاکم",
      content: [
        "این سایت تابع قوانین و مقررات جمهوری اسلامی ایران است.",
        "در صورت بروز اختلاف، مرجع صالح برای رسیدگی دادگاه‌های ایران خواهد بود."
      ]
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
              <span className="text-gray-600">قوانین و مقررات</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <GavelIcon className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              قوانین و مقررات
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              شرایط و ضوابط استفاده از فروشگاه آنلاین لنت شاپ
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <GavelIcon className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                  قوانین و مقررات فروشگاه
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  لطفاً قبل از استفاده از خدمات فروشگاه لنت شاپ، قوانین و مقررات زیر را به دقت مطالعه فرمایید. استفاده از سایت به معنای پذیرش کامل این شرایط است.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                        {index + 1}. {section.title}
                      </h3>
                      <div className="space-y-3">
                        {section.content.map((text, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <p className="text-gray-700 leading-relaxed flex-1">
                              {text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-r-4 border-blue-600">
            <div className="flex items-start gap-4">
              <UpdateIcon className="text-blue-600 text-3xl flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  آخرین بروزرسانی
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  این قوانین ممکن است در طول زمان بروزرسانی شوند. توصیه می‌کنیم به طور دوره‌ای این صفحه را بررسی کنید تا از آخرین تغییرات مطلع شوید.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                سوال یا ابهامی دارید؟
              </h3>
              <p className="text-gray-600 mb-6">
                در صورت داشتن هرگونه سوال یا ابهام در مورد قوانین و مقررات، با ما تماس بگیرید.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-l from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
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

export default Terms;

