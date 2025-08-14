import React from 'react';

const CustomerClub = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">باشگاه مشتریان لنت شاپ</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            به باشگاه مشتریان ما بپیوندید و از مزایای ویژه، تخفیفات و خدمات اختصاصی بهره‌مند شوید
          </p>
        </div>

        {/* Special Membership Benefits - Animated */}
        <div className="bg-blue-600 rounded-2xl shadow-2xl p-8 mb-12 relative overflow-hidden animate-glow">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-8 w-16 h-16 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-8 left-1/3 w-12 h-12 bg-white rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white rounded-full animate-spin"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center animate-pulse">
              مزایای ویژه عضویت در باشگاه مشتریان
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* خرید اول */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 animate-float animate-stagger-1">
                <h3 className="text-xl font-bold text-white mb-2">خرید اول</h3>
                <p className="text-white/90 text-lg font-semibold">ارسال رایگان</p>
                <div className="mt-3 w-full bg-white/30 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full w-full animate-pulse"></div>
                </div>
              </div>

              {/* خرید دوم */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 animate-float animate-stagger-2">
                <h3 className="text-xl font-bold text-white mb-2">خرید دوم</h3>
                <p className="text-white/90 text-lg font-semibold">۱۰ درصد تخفیف</p>
                <div className="mt-3 w-full bg-white/30 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>

              {/* خرید سوم */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 animate-float animate-stagger-3">
                <h3 className="text-xl font-bold text-white mb-2">خرید سوم</h3>
                <p className="text-white/90 text-lg font-semibold">۱۵ درصد تخفیف</p>
                <div className="mt-3 w-full bg-white/30 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full w-1/2 animate-pulse"></div>
                </div>
              </div>

              {/* پشتیبانی */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 animate-float animate-stagger-4">
                <h3 className="text-xl font-bold text-white mb-2">پشتیبانی ویژه</h3>
                <p className="text-white/90 text-lg font-semibold">پاسخگویی در ساعات کاری</p>
                <div className="mt-3 w-full bg-white/30 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* توضیحات اضافی */}
            <div className="mt-8 text-center animate-slide-left">
              <p className="text-white/90 text-lg leading-relaxed max-w-4xl mx-auto">
                <span className="font-bold">پشتیبانی مجموعه در ساعات کاری پاسخگو و راهنمای شما هستند.</span>
                <br />
                <span className="text-white/80">با هر خرید، به سطح بالاتری از مزایا دست پیدا کنید!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Membership Benefits */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">مزایای عضویت</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تخفیفات ویژه</h3>
              <p className="text-gray-600">تا ۳۰٪ تخفیف روی تمامی محصولات و خدمات</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">خدمات رایگان</h3>
              <p className="text-gray-600">معاینه فنی رایگان و مشاوره تخصصی</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-200">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ارسال رایگان</h3>
              <p className="text-gray-600">ارسال رایگان برای سفارشات بالای ۵۰۰ هزار تومان</p>
            </div>

            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition duration-200">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">پشتیبانی ۲۴/۷</h3>
              <p className="text-gray-600">پشتیبانی شبانه‌روزی و پاسخگویی فوری</p>
            </div>
          </div>
        </div>

        {/* Membership Levels */}

        {/* Special Offers */}

        {/* Join Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">به باشگاه مشتریان بپیوندید</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    نام
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نام خانوادگی خود را وارد کنید"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تلفن
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="شماره تلفن خود را وارد کنید"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                عضویت در باشگاه مشتریان
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerClub;
