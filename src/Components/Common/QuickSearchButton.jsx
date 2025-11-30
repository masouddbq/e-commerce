import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import QuickSearchModal from './QuickSearchModal';

const QuickSearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* دکمه جستجوی سریع ثابت */}
      <button
        onClick={openModal}
        className="fixed bottom-20 right-4 sm:bottom-24 lg:hidden sm:right-4 z-40 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 group border-2 border-white/20"
        aria-label="جستجوی سریع"
        title="جستجوی سریع محصولات"
      >
        <SearchIcon className="text-xl sm:text-2xl group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Tooltip - فقط در دسکتاپ */}
        <div className="hidden sm:block absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          جستجوی سریع
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
      </button>

      {/* مودال جستجو */}
      <QuickSearchModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default QuickSearchButton;
