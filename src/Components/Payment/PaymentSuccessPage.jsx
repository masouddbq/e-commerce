import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatAmount } from '../../lib/payment';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  // داده‌های نمونه برای نمایش موفق
  const paymentResult = {
    success: true,
    refId: 'ZP1234567890123456',
    amount: 1500000,
    orderId: 'ORD-2024-001',
    paymentMethod: 'online',
    gateway: 'ZARINPAL',
    bankName: null
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="text-5xl text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-green-600 mb-4">پرداخت موفق!</h1>
          <p className="text-gray-600 mb-8">سفارش شما با موفقیت ثبت شد</p>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">جزئیات پرداخت</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">شماره سفارش:</span>
                <span className="font-semibold">{paymentResult.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">شماره پیگیری:</span>
                <span className="font-semibold">{paymentResult.refId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">مبلغ:</span>
                <span className="font-semibold">
                  {formatAmount(paymentResult.amount)} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">روش پرداخت:</span>
                <span className="font-semibold">
                  {paymentResult.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'کارت به کارت'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">درگاه:</span>
                <span className="font-semibold">زرین‌پال</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout/success', { state: { paymentResult } })}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              مشاهده رسید سفارش
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-colors"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;






















