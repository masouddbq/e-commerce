import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  
  // دسته‌بندی‌های فنی که در breadcrumb نمایش داده نشوند
  const excludeCategories = [
    'دیسکی', 'کفشکی', 'ترمز دستی', 'ترمز پا', 'ترمز جلویی', 'ترمز عقبی',
    'disc', 'shoe', 'manual', 'brake', 'front', 'back', 'di', 'ki',
    'لنت جلو', 'لنت عقب', 'لنت دستی', 'لنت پا',
    // سایر اسامی مشابه
    'di-ski', 'دی-سکی', 'shoe-style', 'کفش-شکل', 'دی‌سکی'
  ];

  // تبدیل مسیر به breadcrumb items
  const getBreadcrumbItems = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    if (pathnames.length === 0) return [];
    
    const breadcrumbItems = [
      {
        name: 'خانه',
        path: '/',
        icon: <HomeIcon className="w-4 h-4" />
      }
    ];
    
    let currentPath = '';
    let breadcrumbIndex = 0;
    
    pathnames.forEach((name, index) => {
      // اگر این نام در لیست دسته‌بندی‌های غیرضروری باشد، آن را نادیده بگیر
      if (excludeCategories.includes(name) || excludeCategories.some(cat => name.toLowerCase().includes(cat.toLowerCase()))) {
        return;
      }
      
      currentPath += `/${name}`;
      
      // تبدیل نام‌های انگلیسی به فارسی
      const persianNames = {
        'about': 'درباره ما',
        'contact': 'تماس با ما',
        'login': 'ورود',
        'register': 'ثبت نام',
        'checkout': 'تکمیل خرید',
        'success': 'موفقیت',
        'club': 'باشگاه مشتریان',
        'search': 'جستجو',
        'specials': 'پیشنهادات ویژه',
        'categories': 'دسته‌بندی‌ها',
        'brands': 'برندها',
        'product': 'محصول',
        'admin': 'پنل مدیریت',
        'cart': 'سبد خرید',
        'profile': 'پروفایل',
        'orders': 'سفارشات',
        'wishlist': 'علاقه‌مندی‌ها',
        'help': 'راهنما',
        'faq': 'سوالات متداول',
        'terms': 'قوانین و مقررات',
        'privacy': 'حریم خصوصی',
        'shipping': 'ارسال',
        'returns': 'بازگشت',
        'support': 'پشتیبانی',
        'vehicle': 'خودرو',
        'suv': 'شاسی بلند',
        'pickup': 'وانت',
        'search-results': 'نتایج جستجو'
      };
      
      // اگر نام در فارسی موجود است، از آن استفاده کن
      let displayName = persianNames[name] || name;
      
      // برای صفحات خاص، نام‌های فارسی اضافه کن
      if (name === 'brands' && params.brandSlug) {
        displayName = 'برندها';
      } else if (name === 'product' && params.brand) {
        displayName = 'محصول';
      } else if (name === 'search-results' && params.searchTerm) {
        displayName = `نتایج جستجو: ${params.searchTerm}`;
      }
      
      breadcrumbItems.push({
        name: displayName,
        path: currentPath,
        isLast: index === pathnames.length - 1
      });
      
      breadcrumbIndex++;
    });
    
    return breadcrumbItems;
  };
  
  const breadcrumbItems = getBreadcrumbItems();
  
  // اگر فقط در صفحه خانه هستیم، breadcrumb نمایش ندهیم
  if (breadcrumbItems.length <= 1) return null;
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 py-2 sm:py-3 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 text-xs sm:text-sm md:text-base overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-1 sm:mx-2 md:mx-3 flex-shrink-0" />
              )}
              
              {item.isLast ? (
                <span className="text-gray-900 font-medium flex items-center gap-1 sm:gap-2 max-w-24 sm:max-w-32 md:max-w-none truncate">
                  {item.icon && <span className="hidden sm:inline">{item.icon}</span>}
                  <span className="truncate">{item.name}</span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 sm:gap-2 hover:underline max-w-20 sm:max-w-24 md:max-w-none truncate"
                >
                  {item.icon && <span className="hidden sm:inline">{item.icon}</span>}
                  <span className="truncate">{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
