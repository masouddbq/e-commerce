import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import CardToCardPayment from './CardToCardPayment';
import PaymentVerification from './PaymentVerification';
import PaymentSuccessPage from './PaymentSuccessPage';
import PaymentErrorPage from './PaymentErrorPage';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const PaymentTestPage = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('menu');

  // داده‌های نمونه برای تست
  const sampleOrderData = {
    orderId: 'ORD-2024-001',
    totalAmount: 1500000, // 1,500,000 تومان
    items: [
      {
        id: 1,
        name: 'لنت جلو تویوتا کمری',
        unit_price: 800000,
        quantity: 1,
        image: '/WEBP/toyota.webp'
      },
      {
        id: 2,
        name: 'لنت عقب تویوتا کمری',
        unit_price: 700000,
        quantity: 1,
        image: '/WEBP/toyota.webp'
      }
    ],
    customerInfo: {
      fullName: 'احمد محمدی',
      email: 'ahmad@example.com',
      phone: '09123456789',
      address: 'تهران، خیابان ولیعصر، پلاک 123',
      postalCode: '1234567890'
    }
  };

  const samplePaymentProof = {
    amount: '1500000',
    transactionId: '1234567890123456',
    bankName: 'ملت',
    cardNumber: '6104-3377-1234-5678'
  };

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">تست UI سیستم پرداخت</h1>
          <p className="text-gray-600 text-lg">انتخاب کنید کدام بخش را می‌خواهید مشاهده کنید</p>
        </div>

        {/* Test Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div
            onClick={() => setCurrentView('payment-form')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-blue-500"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">فرم پرداخت</h3>
              <p className="text-gray-600 text-sm mb-4">
                انتخاب روش پرداخت و درگاه
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-blue-800 text-xs">
                  <strong>مسیر:</strong> /payment/form
                </p>
              </div>
            </div>
          </div>

          {/* Card to Card Payment */}
          <div
            onClick={() => setCurrentView('card-to-card')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-green-500"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AccountBalanceIcon className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">پرداخت کارت به کارت</h3>
              <p className="text-gray-600 text-sm mb-4">
                واریز وجه و تایید پرداخت
              </p>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-green-800 text-xs">
                  <strong>مسیر:</strong> /payment/card-to-card
                </p>
              </div>
            </div>
          </div>

          {/* Payment Verification */}
          <div
            onClick={() => setCurrentView('verification')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-purple-500"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تایید پرداخت</h3>
              <p className="text-gray-600 text-sm mb-4">
                نتیجه پرداخت موفق/ناموفق
              </p>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-purple-800 text-xs">
                  <strong>مسیر:</strong> /payment/verify
                </p>
              </div>
            </div>
          </div>

          {/* Payment Success */}
          <div
            onClick={() => setCurrentView('success')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-green-500"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">پرداخت موفق</h3>
              <p className="text-gray-600 text-sm mb-4">
                نمایش نتیجه پرداخت موفق
              </p>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-green-800 text-xs">
                  <strong>وضعیت:</strong> موفق
                </p>
              </div>
            </div>
          </div>

          {/* Payment Error */}
          <div
            onClick={() => setCurrentView('error')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-red-500"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ErrorIcon className="text-3xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">پرداخت ناموفق</h3>
              <p className="text-gray-600 text-sm mb-4">
                نمایش خطا و راه‌حل
              </p>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-red-800 text-xs">
                  <strong>وضعیت:</strong> ناموفق
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div
            onClick={() => navigate('/payment')}
            className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-indigo-500"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardIcon className="text-3xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">اطلاعات پرداخت</h3>
              <p className="text-gray-600 text-sm mb-4">
                صفحه اصلی اطلاعات پرداخت
              </p>
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-indigo-800 text-xs">
                  <strong>مسیر:</strong> /payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← بازگشت به منو
          </button>
        </div>
        <PaymentForm
          orderData={sampleOrderData}
          onPaymentSuccess={() => console.log('Payment Success')}
          onPaymentError={() => console.log('Payment Error')}
        />
      </div>
    </div>
  );

  const renderCardToCard = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← بازگشت به منو
          </button>
        </div>
        <CardToCardPayment />
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← بازگشت به منو
          </button>
        </div>
        <PaymentVerification />
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← بازگشت به منو
          </button>
        </div>
        <PaymentSuccessPage />
      </div>
    </div>
  );

  const renderError = () => (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('menu')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← بازگشت به منو
          </button>
        </div>
        <PaymentErrorPage />
      </div>
    </div>
  );

  switch (currentView) {
    case 'payment-form':
      return renderPaymentForm();
    case 'card-to-card':
      return renderCardToCard();
    case 'verification':
      return renderVerification();
    case 'success':
      return renderSuccess();
    case 'error':
      return renderError();
    default:
      return renderMenu();
  }
};

export default PaymentTestPage;
