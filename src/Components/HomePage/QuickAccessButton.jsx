import React from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const QuickAccessButton = () => {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 transform hover:scale-105 transition-all duration-500">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <CategoryIcon className="text-white text-3xl" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            دسترسی سریع به دسته‌بندی‌ها
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            با کلیک روی این دکمه به سرعت به تمام برندها و دسته‌بندی‌های موجود دسترسی پیدا کنید 
            و محصولات مورد نظرتان را در کمترین زمان ممکن بیابید.
          </p>
          
          <Link
            to="/categories"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_15px_40px_-15px_rgba(59,130,246,0.6)] transform hover:scale-105 transition-all duration-300 group"
          >
            <span className="ml-2">شروع جستجو</span>
            <ArrowForwardIcon className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessButton;
