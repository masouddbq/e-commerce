import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentManager, PAYMENT_METHODS, PAYMENT_GATEWAYS, formatAmount, validatePaymentData } from '../../lib/payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LoadingIcon from '@mui/icons-material/HourglassEmpty';

const PaymentForm = ({ orderData: propOrderData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS.ONLINE.id);
  const [selectedGateway, setSelectedGateway] = useState('ZARINPAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentManager] = useState(new PaymentManager());

  // اطلاعات سفارش از state یا props
  const orderData = location.state?.orderData || propOrderData;

  // اگر orderData وجود نداشته باشه، به صفحه اصلی برگرد
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  useEffect(() => {
    if (!orderData) return;
    
    // اعتبارسنجی اولیه
    const validation = validatePaymentData({
      amount: orderData.totalAmount,
      description: orderData.description,
      customerInfo: orderData.customerInfo
    });

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
    }
  }, [orderData]);

  if (!orderData) {
    return null;
  }

  const {
    orderId,
    totalAmount,
    items,
    customerInfo,
    description = 'خرید از لنت شاپ'
  } = orderData;

  const handlePaymentMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    setError('');
  };

  const handleGatewayChange = (gatewayName) => {
    setSelectedGateway(gatewayName);
    setError('');
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      // انتخاب درگاه پرداخت
      paymentManager.selectGateway(selectedGateway);

      // تنظیم اطلاعات پرداخت
      const paymentData = {
        amount: totalAmount,
        description,
        orderId,
        customerInfo,
        callbackUrl: `${window.location.origin}/payment/callback`
      };

      paymentManager.setPaymentData(paymentData);

      // ایجاد درخواست پرداخت
      const result = await paymentManager.createPaymentRequest();

      if (result.success) {
        // ذخیره اطلاعات پرداخت در localStorage
        localStorage.setItem('paymentData', JSON.stringify({
          orderId,
          authority: result.authority,
          gateway: selectedGateway,
          amount: totalAmount,
          timestamp: Date.now()
        }));

        // هدایت به درگاه پرداخت
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.message || 'خطا در ایجاد درخواست پرداخت');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardToCardPayment = () => {
    // برای پرداخت کارت به کارت، اطلاعات حساب را نمایش دهید
    navigate('/payment/card-to-card', {
      state: {
        orderData,
        paymentMethod: PAYMENT_METHODS.CARD_TO_CARD
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCardIcon className="text-3xl text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">انتخاب روش پرداخت</h2>
        <p className="text-gray-600">روش پرداخت مورد نظر خود را انتخاب کنید</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">خلاصه سفارش</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">شماره سفارش:</span>
            <span className="font-semibold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">تعداد کالا:</span>
            <span className="font-semibold">{items.length} عدد</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-800">مبلغ قابل پرداخت:</span>
            <span className="text-blue-600">{formatAmount(totalAmount)} تومان</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">روش‌های پرداخت</h3>
        <div className="space-y-3">
          {Object.values(PAYMENT_METHODS).map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.enabled && handlePaymentMethodChange(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMethod === method.id && (
                    <CheckCircleIcon className="text-blue-600" />
                  )}
                  {!method.enabled && (
                    <span className="text-xs text-gray-500">به زودی</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gateway Selection (for online payment) */}
      {selectedMethod === PAYMENT_METHODS.ONLINE.id && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">انتخاب درگاه پرداخت</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(PAYMENT_GATEWAYS).map(([key, gateway]) => (
              <div
                key={key}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedGateway === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!gateway.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => gateway.enabled && handleGatewayChange(key)}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {gateway.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {gateway.enabled ? 'فعال' : 'غیرفعال'}
                  </div>
                  {gateway.sandbox && (
                    <div className="text-xs text-orange-600 mt-1">نسخه تست</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <SecurityIcon className="text-green-600" />
          <h4 className="font-semibold text-green-800">امنیت پرداخت</h4>
        </div>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• تمام اطلاعات با پروتکل SSL رمزنگاری می‌شوند</li>
          <li>• اطلاعات کارت بانکی شما ذخیره نمی‌شود</li>
          <li>• پرداخت از طریق درگاه‌های معتبر بانکی انجام می‌شود</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <ErrorIcon className="text-red-600" />
            <span className="text-red-800 font-semibold">خطا</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <div className="space-y-3">
        {selectedMethod === PAYMENT_METHODS.ONLINE.id ? (
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedGateway}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <LoadingIcon className="animate-spin" />
                در حال اتصال به درگاه...
              </>
            ) : (
              <>
                <CreditCardIcon />
                پرداخت آنلاین
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleCardToCardPayment}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <AccountBalanceIcon />
            پرداخت کارت به کارت
          </button>
        )}

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold transition-colors"
        >
          بازگشت به تکمیل سفارش
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;





















