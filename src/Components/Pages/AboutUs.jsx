import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            درباره لنت شاپ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ما متعهد به ارائه بهترین خدمات و محصولات خودرویی با کیفیت بالا و
            قیمت مناسب برای مشتریان عزیزمان هستیم
          </p>
        </div>

        {/* Company Story */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                داستان ما
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                ما در لنت شاپ با بیش از ۱۰ سال تجربه در زمینه فروش لنت ترمز
                افتخار داریم ، محصولات با کیفیت و مقرون به صرفه را به رانندگان
                عزیز ایرانی ارائه کنیم.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                محصولات مجموعه ما همگی اورجینال و اصل بوده و تمام اجناس ایرانی
                دارای گارانتی کیفیت و کالا های خارجی ضمانت اصلی بودن را دارا
                هستند.
              </p>
              <p className="text-gray-600 leading-relaxed">
                هدف فروشگاه لنت شاپ این است که خرید لنت ترمز را برای شما ساده ،
                سریع و مطمئن نماید. با تیمی متعهد همواره تلاش می کنیم بهترین
                تجربه خرید اینترنتی را برایتان فراهم کنیم.
              </p>
            </div>
            <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">تصویر شرکت در اینجا قرار می‌گیرد</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">ماموریت ما</h3>
            </div>
            <p className="text-gray-600 text-center leading-relaxed">
              ارائه خدمات با کیفیت و محصولات اصل با قیمت مناسب، همراه با رضایت
              کامل مشتریان و ایجاد اعتماد در جامعه
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">چشم‌انداز ما</h3>
            </div>
            <p className="text-gray-600 text-center leading-relaxed">
              تبدیل شدن به برترین مرکز خدمات خودرویی در ایران و ارائه خدمات
              بین‌المللی با استانداردهای جهانی
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            ارزش‌های ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">کیفیت</h3>
              <p className="text-gray-600">
                ارائه بهترین کیفیت در تمامی خدمات و محصولات
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">اعتماد</h3>
              <p className="text-gray-600">
                ایجاد اعتماد و اطمینان در روابط با مشتریان
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">نوآوری</h3>
              <p className="text-gray-600">
                استفاده از جدیدترین تکنولوژی‌ها و روش‌ها
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            آمار و دستاوردها
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">۵۰۰۰+</div>
              <div className="text-blue-100">مشتری راضی</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">۱۰+</div>
              <div className="text-blue-100">سال تجربه</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">۵۰+</div>
              <div className="text-blue-100">کارشناس متخصص</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">۲۴/۷</div>
              <div className="text-blue-100">پشتیبانی</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            تیم متخصص ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-600">تصویر مدیر</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                احمد محمدی
              </h3>
              <p className="text-blue-600 mb-2">مدیرعامل</p>
              <p className="text-gray-600">
                متخصص با ۱۵ سال تجربه در صنعت خودرو
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-600">تصویر مدیر فنی</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                علی رضایی
              </h3>
              <p className="text-blue-600 mb-2">مدیر فنی</p>
              <p className="text-gray-600">
                مهندس مکانیک با تخصص در تعمیرات پیشرفته
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                <p className="text-gray-600">تصویر مدیر فروش</p>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                فاطمه کریمی
              </h3>
              <p className="text-blue-600 mb-2">مدیر فروش</p>
              <p className="text-gray-600">متخصص بازاریابی و مدیریت مشتریان</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
