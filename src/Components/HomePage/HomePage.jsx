import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSlider from './HeroSlider';
import BrandCategories from './BrandCategories';
import FeaturesSection from './FeaturesSection';
import CustomerReviews from './CustomerReviews';
import NewsletterSection from './NewsletterSection';
import AboutSection from './AboutSection';
import ProductsAndOffers from './ProductsAndOffers';
import QuickSearchModal from '../Common/QuickSearchModal';
import QuickSearchButton from './QuickSearchButton';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // بستن مودال راهنما هنگام کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isHelpModalOpen && !event.target.closest('.help-modal-container')) {
        setIsHelpModalOpen(false);
      }
    };

    if (isHelpModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isHelpModalOpen]);

  return (
    <>
      <Helmet>
        <title>لنت شاپ | فروشگاه تخصصی لنت خودرو با بهترین کیفیت و قیمت</title>
        <meta name="description" content="لنت شاپ - بزرگترین فروشگاه آنلاین لنت ترمز خودرو در ایران. لنت جلو، لنت عقب، لنت دستی و لنت پا برای تمام برندها با بهترین قیمت و کیفیت تضمینی. خرید آنلاین و ارسال سریع به سراسر کشور." />
        <meta name="keywords" content="لنت خودرو, لنت ترمز, لنت کلاچ, لنت شاپ, فروشگاه لنت, لنت جلو, لنت عقب, خرید لنت" />
        <meta property="og:title" content="لنت شاپ | فروشگاه تخصصی لنت خودرو" />
        <meta property="og:description" content="لنت شاپ - فروشگاه تخصصی لنت خودرو با بهترین کیفیت و قیمت. خرید آنلاین لنت ترمز برای تمام برندها" />
        <meta property="og:url" content="https://lent-shop.ir/" />
        
        <link rel="canonical" href="https://lent-shop.ir/" />
      </Helmet>
      <div className='flex flex-col w-full max-w-full overflow-hidden'>
      <BrandCategories />
      
      {/* Search Bar - نوار جستجو (فقط دسکتاپ) */}
      <div className="hidden lg:block lg:mb-10 items-center w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 sm:px-6 lg:px-32">
        <div className="max-w-2xl bg-white bg-opacity-20 rounded-xl mx-auto">
          <div className="w-full flex items-center justify-center gap-4 text-white hover:bg-white hover:bg-opacity-20 transition-all duration-300 rounded-lg py-1 px-6 group">
          <button
            onClick={openSearchModal}
              className="flex items-center justify-center gap-4 flex-1"
          >
            <SearchIcon className="text-xl group-hover:scale-110 transition-transform duration-300" />
            <span className="text-lg font-medium">جستجوی سریع محصولات و برندها</span>
            <SearchIcon className="text-xl group-hover:scale-110 transition-transform duration-300" />
          </button>
            <div className="relative flex-shrink-0 help-modal-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHelpModalOpen(!isHelpModalOpen);
                }}
                onMouseEnter={() => setIsHelpModalOpen(true)}
                className="p-1 hover:bg-white hover:bg-opacity-30 rounded-full transition-all duration-300"
                aria-label="راهنما"
              >
                <HelpOutlineIcon className="text-lg" />
              </button>
              {/* Help Modal - Tooltip */}
              {isHelpModalOpen && (
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 bg-white text-gray-800 rounded-lg shadow-xl p-4 text-sm z-50 border border-gray-200 help-modal-container"
                  onMouseEnter={() => setIsHelpModalOpen(true)}
                  onMouseLeave={() => setIsHelpModalOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-right leading-relaxed">
                    توجه کنید که در جستجو هر کلمه محصولات مشابه قابل استفاده نسبت به محصول شما هم نمایش داده خواهد شد
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Access to Categories Button - دکمه دسترسی سریع به دسته‌بندی‌ها (فقط دسکتاپ) */}
      <div className="hidden lg:block lg:mb-2 lg:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Link
              to="/categories"
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 text-blue-600 hover:bg-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-blue-600/75 hover:shadow-blue-500/40"
            >
              <CategoryIcon className="text-xl text-blue-600" />
              <span className="text-lg font-medium text-blue-600">دسترسی سریع به دسته‌بندی‌ها</span>
            </Link>
          </div>
        </div>
      </div>
      
      <ProductsAndOffers />
      
      {/* Quick Search Button - دکمه دایره‌ای (فقط موبایل و تبلت) */}
      <div className="lg:hidden">
        <QuickSearchButton />
      </div>
      
      {/* Hero Slider - کاروسل عکس‌ها بالای بخش درباره لنت شاپ */}
      <HeroSlider />
      
      <AboutSection />
      <CustomerReviews />
      <FeaturesSection />
      <NewsletterSection />

      {/* Quick Search Modal */}
      <QuickSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal} 
      />
    </div>
    </>
  )
}

export default HomePage