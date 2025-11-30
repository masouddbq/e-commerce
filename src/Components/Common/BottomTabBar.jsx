import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GroupIcon from '@mui/icons-material/Group';

const BottomTabBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // تشخیص تب فعال بر اساس مسیر فعلی
    if (location.pathname.includes('/categories')) return 'categories';
    if (location.pathname.includes('/specials')) return 'featured';
    if (location.pathname.includes('/club')) return 'club';
    return 'home';
  });

  const tabs = [
    {
      id: 'scrollTop',
      label: 'برو بالا',
      icon: KeyboardArrowUpIcon,
      action: () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      },
      color: 'text-blue-500'
    },
    {
      id: 'featured',
      label: 'محصولات ویژه',
      icon: StarIcon,
      path: '/specials',
      color: 'text-blue-500'
    },
    {
      id: 'categories',
      label: 'دسته‌بندی‌ها',
      icon: CategoryIcon,
      path: '/categories',
      color: 'text-blue-500'
    },
    {
      id: 'club',
      label: 'باشگاه مشتریان',
      icon: GroupIcon,
      path: '/club',
      color: 'text-blue-500'
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          // اگر تب action داشته باشد (مثل برو بالا)، از button استفاده کن
          if (tab.action) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  tab.action();
                  handleTabClick(tab.id);
                }}
                className={`flex flex-col items-center justify-center flex-1 min-w-0 transition-all duration-300 ease-out ${
                  isActive 
                    ? 'text-blue-600 scale-105' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`relative p-1.5 rounded-full transition-all duration-300 ease-out ${
                  isActive 
                    ? 'bg-blue-100 scale-110 shadow-md shadow-blue-200/50' 
                    : 'hover:bg-gray-100 hover:scale-105'
                }`}>
                  <IconComponent 
                    className={`text-base transition-all duration-300 ${
                      isActive ? 'text-blue-600' : tab.color
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-md"></div>
                  )}
                </div>
                <span className={`text-xs mt-0.5 font-medium transition-all duration-300 ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-black'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          }
          
          // برای تب‌های معمولی از Link استفاده کن
          return (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 transition-all duration-300 ease-out ${
                isActive 
                  ? 'text-blue-600 scale-105' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className={`relative p-1.5 rounded-full transition-all duration-300 ease-out ${
                isActive 
                  ? 'bg-blue-100 scale-110 shadow-md shadow-blue-200/50' 
                  : 'hover:bg-gray-100 hover:scale-105'
              }`}>
                <IconComponent 
                  className={`text-base transition-all duration-300 ${
                    isActive ? 'text-blue-600' : tab.color
                  }`}
                />
                {isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse shadow-md"></div>
                )}
              </div>
              <span className={`text-xs mt-0.5 font-medium transition-all duration-300 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-black'
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      

    </div>
  );
};

export default BottomTabBar;
