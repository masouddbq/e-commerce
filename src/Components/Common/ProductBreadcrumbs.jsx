import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, HomeIcon, TagIcon } from '@heroicons/react/24/outline';

const ProductBreadcrumbs = ({ productName, brandName, categoryName }) => {
  const params = useParams();
  const location = useLocation();
  
  // دسته‌بندی‌های فنی که در breadcrumb نمایش داده نشوند
  const excludeTechnicalCategories = [
    'دیسکی', 'کفشکی', 'ترمز دستی', 'ترمز پا', 'ترمز جلویی', 'ترمز عقبی',
    'disc', 'shoe', 'manual', 'brake', 'front', 'back', 'di', 'ki',
    'لنت جلو', 'لنت عقب', 'لنت دستی', 'لنت پا',
    'di-ski', 'دی-سکی', 'shoe-style', 'کفش-شکل', 'دی‌سکی'
  ];
  
  // چک کردن که آیا categoryName باید نمایش داده شود یا نه
  const shouldDisplayCategory = (catName) => {
    if (!catName) return false;
    const catLower = catName.toLowerCase();
    return !excludeTechnicalCategories.some(exclude => 
      catLower === exclude.toLowerCase() || 
      catLower.includes(exclude.toLowerCase())
    );
  };
  
  const breadcrumbItems = [
    {
      name: 'خانه',
      path: '/',
      icon: <HomeIcon className="w-4 h-4" />
    },
    {
      name: 'دسته‌بندی‌ها',
      path: '/categories',
      icon: <TagIcon className="w-4 h-4" />
    }
  ];
  
  // اضافه کردن دسته‌بندی اگر موجود باشد و جزو دسته‌های فنی نباشد
  if (categoryName && shouldDisplayCategory(categoryName)) {
    breadcrumbItems.push({
      name: categoryName,
      path: `/categories`,
      isLast: false
    });
  }
  
  // اضافه کردن برند اگر موجود باشد
  if (brandName) {
    // تبدیل نام برند به slug
    const getBrandSlug = (brand) => {
      const slugMap = {
        'تویوتا': 'toyota',
        'هیوندای': 'hyundai',
        'نیسان': 'nissan',
        'کیا': 'kia',
        'لکسوس': 'lexus',
        'جیلی': 'geely',
        'مزدا': 'mazda',
        'ام‌جی': 'mg',
        'ام جی': 'mg',
        'میتسوبیشی': 'mitsubishi',
        'فولکس‌واگن': 'volkswagen',
        'فولکس واگن': 'volkswagen',
        'سایپا': 'saipa',
        'سوزوکی': 'suzuki',
        'رنو': 'renault',
        'پژو': 'peugeot',
        'ایران خودرو': 'irankhodro',
        'ایران‌خودرو': 'irankhodro',
        'فاو': 'faw'
      };
      return slugMap[brand] || brand.toLowerCase().replace(/\s+/g, '-');
    };
    
    const brandSlug = getBrandSlug(brandName);
    
    breadcrumbItems.push({
      name: brandName,
      path: `/brand-products/${brandSlug}`,
      isLast: false
    });
  }
  
  // اضافه کردن نام محصول
  if (productName) {
    breadcrumbItems.push({
      name: productName,
      path: location.pathname,
      isLast: true
    });
  }
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 py-2 sm:py-3 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mt-6 lg:mt-0 mx-auto">
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

export default ProductBreadcrumbs;
