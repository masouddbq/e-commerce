import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

const PaymentErrorPage = () => {
  const navigate = useNavigate();

  const error = 'پرداخت ناموفق بود. لطفاً مجدداً تلاش کنید.';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ErrorIcon className="text-5xl text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-red-600 mb-4">پرداخت ناموفق!</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto mb-8">
            <h3 className="font-semibold text-red-800 mb-2">علل احتمالی:</h3>
            <ul className="text-sm text-red-700 space-y-1 text-right">
              <li>• عدم موجودی کافی در حساب</li>
              <li>• اشتباه در وارد کردن اطلاعات کارت</li>
              <li>• انقضای کارت بانکی</li>
              <li>• مشکل موقت در سیستم بانکی</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              تلاش مجدد
            </button>
            
            <button
              onClick={() => navigate('/payment')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-colors"
            >
              انتخاب روش پرداخت دیگر
            </button>
            
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl py-3 font-semibold transition-colors"
            >
              تماس با پشتیبانی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;






















