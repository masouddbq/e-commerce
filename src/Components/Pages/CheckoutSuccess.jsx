import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  const [sp] = useSearchParams();
  const orderId = sp.get('orderId');
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-3">سفارش با موفقیت ثبت شد</h1>
        <p className="text-gray-700 mb-6">کد سفارش شما: <span className="font-mono">{orderId || '-'}</span></p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">بازگشت به خانه</Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;


