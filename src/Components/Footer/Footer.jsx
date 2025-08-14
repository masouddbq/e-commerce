import React from "react";
import { Link } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const footerLinks = [
    { id: 1, title: "پراید", link: "/vehicle" },
    { id: 2, title: "نیسان دیزل", link: "/pickup" },
    { id: 3, title: "سراتو سایپا", link: "/vehicle" },
    { id: 4, title: "جیلی", link: "/suv" },
  ];
  
  const trends = [
    { id: 1, title: "لنت جلو", link: "/vehicle" },
    { id: 2, title: "لنت عقب", link: "/vehicle" },
    { id: 3, title: "لنت دستی", link: "/vehicle" },
    { id: 4, title: "لنت پا", link: "/vehicle" },
  ];

  const companyLinks = [
    { id: 1, title: "درباره ما", link: "/about" },
    { id: 2, title: "تماس با ما", link: "/contact" },
    { id: 3, title: "باشگاه مشتریان", link: "/club" },
    { id: 4, title: "قوانین و مقررات", link: "/terms" },
    { id: 5, title: "حریم خصوصی", link: "/privacy" },
  ];

  const customerLinks = [
    { id: 1, title: "راهنمای خرید", link: "/guide" },
    { id: 2, title: "شیوه‌های پرداخت", link: "/payment" },
    { id: 3, title: "شرایط ارسال", link: "/shipping" },
    { id: 4, title: "بازگشت کالا", link: "/return" },
  ];

  return (
    <>
      <div className="w-full bg-gradient-to-t from-blue-900 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* اطلاعات شرکت */}
            <div className="lg:col-span-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">لنت شاپ</h1>
              <p className="text-blue-100 mb-4 leading-relaxed text-sm sm:text-base">
                فروشگاه تخصصی لنت ترمز خودرو با بیش از 10 سال تجربه در ارائه بهترین محصولات و خدمات
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <LocationOnIcon className="text-blue-200 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold leading-relaxed">مشهد - بلوار کوشش - کوشش ۲۹</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="text-blue-200 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold">۰۹۲۰۹۳۵۰۲۳۵</span>
                </div>
                <div className="flex items-start">
                  <PhoneIcon className="text-blue-200 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-bold leading-relaxed">ساعت کاری همه روزه از ۸:۳۰ الی ۱۹:۳۰ (به جز جمعه)</span>
                </div>
              </div>
            </div>

            {/* محصولات پرفروش */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-200">محصولات پرفروش</h3>
              <ul className="space-y-1 sm:space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <Link 
                      to={link.link} 
                      className="text-blue-100 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* لینک‌های شرکت */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-200">شرکت</h3>
              <ul className="space-y-1 sm:space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.id}>
                    <Link 
                      to={link.link} 
                      className="text-blue-100 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* خدمات مشتریان */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-200">خدمات مشتریان</h3>
              <ul className="space-y-1 sm:space-y-2">
                {customerLinks.map((link) => (
                  <li key={link.id}>
                    <Link 
                      to={link.link} 
                      className="text-blue-100 hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div className="border-t border-blue-500 pt-6 sm:pt-8 mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <FacebookIcon className="text-white text-sm sm:text-base" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <TwitterIcon className="text-white text-sm sm:text-base" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <InstagramIcon className="text-white text-sm sm:text-base" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <YouTubeIcon className="text-white text-sm sm:text-base" />
                </a>
              </div>
              
              <div className="text-center sm:text-right">
                <p className="text-blue-200 text-xs sm:text-sm">
                  © 1404 لنت شاپ - تمامی حقوق محفوظ است
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
