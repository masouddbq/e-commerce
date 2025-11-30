import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PaymentIcon from '@mui/icons-material/Payment';
import { PaymentManager, PAYMENT_STATUS } from '../../lib/payment';

const PaymentVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState('');

  // دریافت اطلاعات از URL یا state
  const urlParams = new URLSearchParams(window.location.search);
  const authority = urlParams.get('Authority') || urlParams.get('authority');
  const status = urlParams.get('Status') || urlParams.get('status');
  
  // یا از state (برای پرداخت کارت به کارت)
  const { orderData, paymentMethod, paymentProof } = location.state || {};

  useEffect(() => {
    if (authority && status) {
      // پرداخت آنلاین
      verifyOnlinePayment();
    } else if (paymentMethod === 'card_to_card' && paymentProof) {
      // پرداخت کارت به کارت
      verifyCardToCardPayment();
    } else {
      // برای تست - اگر هیچ اطلاعاتی نیست، حالت موفق را نمایش بده
      if (location.pathname.includes('/payment/test')) {
        setPaymentResult({
          success: true,
          refId: 'TEST123456789',
          amount: 1500000,
          orderId: 'ORD-2024-001',
          paymentMethod: 'online',
          gateway: 'ZARINPAL'
        });
        setVerificationStatus('success');
      } else {
        setError('اطلاعات پرداخت یافت نشد');
        setVerificationStatus('error');
      }
    }
  }, [authority, status, paymentMethod, paymentProof, location.pathname]);

  const verifyOnlinePayment = async () => {
    try {
      setVerificationStatus('verifying');
      
      // دریافت اطلاعات پرداخت از localStorage
      const paymentData = JSON.parse(localStorage.getItem('paymentData') || '{}');
      
      if (!paymentData.authority || paymentData.authority !== authority) {
        throw new Error('اطلاعات پرداخت نامعتبر است');
      }

      const paymentManager = new PaymentManager();
      paymentManager.selectGateway(paymentData.gateway);

      // تبدیل قیمت از تومان به ریال (ضرب در 10) برای تایید
      const amountInRials = Math.round((paymentData.amount || 0) * 10);

      // تایید پرداخت
      const result = await paymentManager.verifyPayment(authority, amountInRials, paymentData.orderId);

      if (result.success) {
        setPaymentResult({
          success: true,
          refId: result.refId,
          amount: paymentData.amount,
          orderId: paymentData.orderId,
          gateway: paymentData.gateway,
          paymentMethod: 'online'
        });
        setVerificationStatus('success');
        
        // پاک کردن اطلاعات پرداخت از localStorage
        localStorage.removeItem('paymentData');
      } else {
        throw new Error(result.message || 'پرداخت ناموفق بود');
      }
    } catch (err) {
      setError(err.message);
      setVerificationStatus('error');
    }
  };

  const verifyCardToCardPayment = async () => {
    try {
      setVerificationStatus('verifying');
      
      // TODO: ارسال اطلاعات به سرور برای تایید
      // شبیه‌سازی تایید پرداخت کارت به کارت
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentResult({
        success: true,
        refId: paymentProof.transactionId,
        amount: orderData.totalAmount,
        orderId: orderData.orderId,
        paymentMethod: 'card_to_card',
        bankName: paymentProof.bankName
      });
      setVerificationStatus('success');
    } catch (err) {
      setError('خطا در تایید پرداخت کارت به کارت');
      setVerificationStatus('error');
    }
  };

  const renderVerifying = () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">در حال تایید پرداخت...</h2>
      <p className="text-gray-600">لطفاً صبر کنید</p>
    </div>
  );

  const renderSuccess = () => (
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
              {new Intl.NumberFormat('fa-IR').format(paymentResult.amount)} تومان
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">روش پرداخت:</span>
            <span className="font-semibold">
              {paymentResult.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'کارت به کارت'}
            </span>
          </div>
          {paymentResult.bankName && (
            <div className="flex justify-between">
              <span className="text-gray-600">بانک:</span>
              <span className="font-semibold">{paymentResult.bankName}</span>
            </div>
          )}
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
  );

  const renderError = () => (
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
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {verificationStatus === 'verifying' && renderVerifying()}
        {verificationStatus === 'success' && renderSuccess()}
        {verificationStatus === 'error' && renderError()}
      </div>
    </div>
  );
};

export default PaymentVerification;
