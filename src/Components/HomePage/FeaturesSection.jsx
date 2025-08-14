import React from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedIcon from '@mui/icons-material/Verified';
import PaymentIcon from '@mui/icons-material/Payment';
import SpeedIcon from '@mui/icons-material/Speed';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: <LocalShippingIcon className="text-4xl" />,
      title: "ارسال سریع",
      description: "ارسال رایگان برای خریدهای بالای 500 هزار تومان در سراسر کشور"
    },
    {
      id: 2,
      icon: <SecurityIcon className="text-4xl" />,
      title: "کیفیت تضمینی",
      description: "تمام محصولات ما دارای گارانتی اصالت و کیفیت هستند"
    },
    {
      id: 3,
      icon: <SupportAgentIcon className="text-4xl" />,
      title: "پشتیبانی 24/7",
      description: "تیم پشتیبانی ما در تمام ساعات شبانه‌روز آماده خدمت‌رسانی است"
    },
    {
      id: 4,
      icon: <VerifiedIcon className="text-4xl" />,
      title: "تضمین اصالت",
      description: "تمام محصولات ما از برندهای معتبر و دارای مجوزهای لازم هستند"
    },
    {
      id: 5,
      icon: <PaymentIcon className="text-4xl" />,
      title: "پرداخت امن",
      description: "امکان پرداخت آنلاین و در محل با امنیت کامل"
    },
    {
      id: 6,
      icon: <SpeedIcon className="text-4xl" />,
      title: "خدمات سریع",
      description: "ارائه خدمات تعمیر و نگهداری در کمترین زمان ممکن"
    }
  ];

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">چرا لنت شاپ؟</h2>
          <p className="text-gray-600">ما متعهد به ارائه بهترین خدمات و محصولات به مشتریان خود هستیم</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* آمار و ارقام */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">سال تجربه</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">مشتری راضی</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">نوع محصول</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">پشتیبانی</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
