import React from "react";
import { Link } from "react-router-dom";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const footerLinks = [
    { id: 1, title: "پراید", link: "/search-results/پراید" },
    { id: 2, title: "نیسان دیزل", link: "/search-results/نیسان-دیزل" },
    { id: 3, title: "سراتو سایپا", link: "/search-results/سراتو" },
    { id: 4, title: "جیلی", link: "/search-results/جیلی" },
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

  // شماره‌های واتساپ و تلگرام
  const whatsappNumber = "989158337158"; // شماره بدون +98
  const telegramUsername = "Pouya_shabaniii"; // نام کاربری تلگرام

  // تابع‌های باز کردن چت
  const openWhatsApp = () => {
    const message = "سلام! می‌خوام در مورد محصولات لنت شاپ سوال کنم.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openTelegram = () => {
    const telegramUrl = `https://t.me/${telegramUsername}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <>
      <div className="w-[98vw] bg-gradient-to-t shadow-2xl shadow-blue-800 from-blue-900 to-blue-600 text-white">
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

          {/* شبکه‌های اجتماعی و نشان اعتماد */}
          <div className="border-t border-blue-500 pt-6 sm:pt-8 mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0">
              <div className="order-1 sm:order-none flex justify-center sm:justify-start">
                <a 
                  referrerPolicy='origin' 
                  target='_blank' 
                  href='https://trustseal.enamad.ir/?id=669202&Code=HU5etIK8bkqXyZUrIILpcX81G93tlGN1'
                  className="inline-block"
                >
                  <img 
                    referrerPolicy='origin' 
                    src='https://trustseal.enamad.ir/logo.aspx?id=669202&Code=HU5etIK8bkqXyZUrIILpcX81G93tlGN1' 
                    alt='نشان اعتماد الکترونیک اینماد' 
                    style={{cursor:'pointer'}} 
                    code='HU5etIK8bkqXyZUrIILpcX81G93tlGN1'
                  />
                </a>
              </div>

              <div className="order-2 sm:order-none flex space-x-3 sm:space-x-4">
                {/* واتساپ */}
                <button 
                  onClick={openWhatsApp}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer"
                  title="چت در واتساپ"
                >
                  <WhatsAppIcon className="text-white text-sm sm:text-base" />
                </button>
                
                {/* تلگرام */}
                <button 
                  onClick={openTelegram}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer"
                  title="چت در تلگرام"
                >
                  <TelegramIcon className="text-white text-sm sm:text-base" />
                </button>
              </div>
              
              <div className="order-3 sm:order-none text-center sm:text-right">
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
