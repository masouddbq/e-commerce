import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatAmount } from '../../lib/payment';

const CardToCardPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  
  const [copiedField, setCopiedField] = useState('');
  const [paymentProof, setPaymentProof] = useState({
    amount: '',
    transactionId: '',
    bankName: '',
    cardNumber: ''
  });

  // اطلاعات حساب بانکی (در واقعیت باید از دیتابیس بیاید)
  const bankAccounts = [
    {
      id: 1,
      bankName: 'بانک ملت',
      accountNumber: '1234567890123456',
      cardNumber: '6104-3377-1234-5678',
      accountHolder: 'لنت شاپ',
      isActive: true
    },
    {
      id: 2,
      bankName: 'بانک پارسیان',
      accountNumber: '9876543210987654',
      cardNumber: '6274-1234-5678-9012',
      accountHolder: 'لنت شاپ',
      isActive: true
    }
  ];

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('خطا در کپی کردن:', err);
    }
  };

  const handleSubmitPayment = () => {
    // اعتبارسنجی فرم
    if (!paymentProof.amount || !paymentProof.transactionId || !paymentProof.bankName) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    // TODO: ارسال اطلاعات پرداخت به سرور
    console.log('Payment proof submitted:', paymentProof);
    
    // هدایت به صفحه تایید
    navigate('/payment/verify', {
      state: {
        orderData,
        paymentMethod: 'card_to_card',
        paymentProof
      }
    });
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">خطا</h2>
          <p className="text-gray-600 mb-6">اطلاعات سفارش یافت نشد</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AccountBalanceIcon className="text-3xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">پرداخت کارت به کارت</h1>
          <p className="text-gray-600">مبلغ سفارش را به یکی از حساب‌های زیر واریز کنید</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Accounts */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">حساب‌های بانکی</h2>
            
            {bankAccounts.map((account) => (
              <div key={account.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{account.bankName}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    فعال
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">شماره کارت:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-800">{account.cardNumber}</span>
                      <button
                        onClick={() => copyToClipboard(account.cardNumber, `card-${account.id}`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {copiedField === `card-${account.id}` ? (
                          <CheckCircleIcon className="text-green-600 text-sm" />
                        ) : (
                          <ContentCopyIcon className="text-gray-500 text-sm" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">شماره حساب:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-800">{account.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, `account-${account.id}`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {copiedField === `account-${account.id}` ? (
                          <CheckCircleIcon className="text-green-600 text-sm" />
                        ) : (
                          <ContentCopyIcon className="text-gray-500 text-sm" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">صاحب حساب:</span>
                    <span className="font-semibold text-gray-800">{account.accountHolder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">خلاصه سفارش</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">شماره سفارش:</span>
                  <span className="font-semibold">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد کالا:</span>
                  <span className="font-semibold">{orderData.items.length} عدد</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">مبلغ قابل پرداخت:</span>
                    <span className="text-blue-600">{formatAmount(orderData.totalAmount)} تومان</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Proof Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">تایید پرداخت</h2>
              <p className="text-gray-600 text-sm mb-6">
                پس از واریز وجه، اطلاعات زیر را تکمیل کنید:
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مبلغ واریزی *
                  </label>
                  <input
                    type="text"
                    value={paymentProof.amount}
                    onChange={(e) => setPaymentProof({...paymentProof, amount: e.target.value})}
                    placeholder={formatAmount(orderData.totalAmount)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره پیگیری تراکنش *
                  </label>
                  <input
                    type="text"
                    value={paymentProof.transactionId}
                    onChange={(e) => setPaymentProof({...paymentProof, transactionId: e.target.value})}
                    placeholder="مثال: 1234567890123456"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام بانک مبدا *
                  </label>
                  <select
                    value={paymentProof.bankName}
                    onChange={(e) => setPaymentProof({...paymentProof, bankName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="ملت">بانک ملت</option>
                    <option value="پارسیان">بانک پارسیان</option>
                    <option value="ملی">بانک ملی</option>
                    <option value="صادرات">بانک صادرات</option>
                    <option value="تجارت">بانک تجارت</option>
                    <option value="سپه">بانک سپه</option>
                    <option value="کشاورزی">بانک کشاورزی</option>
                    <option value="مسکن">بانک مسکن</option>
                    <option value="پست بانک">پست بانک</option>
                    <option value="دیگر">سایر بانک‌ها</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره کارت مبدا (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={paymentProof.cardNumber}
                    onChange={(e) => setPaymentProof({...paymentProof, cardNumber: e.target.value})}
                    placeholder="مثال: 6104-3377-1234-5678"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <button
                onClick={handleSubmitPayment}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-6"
              >
                تایید پرداخت
              </button>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-2">نکات مهم:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• مبلغ دقیق سفارش را واریز کنید</li>
                <li>• شماره پیگیری تراکنش را صحیح وارد کنید</li>
                <li>• پس از واریز، حداکثر 24 ساعت صبر کنید</li>
                <li>• در صورت مشکل با پشتیبانی تماس بگیرید</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardToCardPayment;






















