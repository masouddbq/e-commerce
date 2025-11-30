import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCart } from '../Common/CartContext';
import Breadcrumbs from '../Common/Breadcrumbs';

const formatCurrency = (n) => new Intl.NumberFormat('fa-IR').format(Math.round(n || 0));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// فلگ برای فعال/غیرفعال کردن OTP (برای تست درگاه پرداخت)
const ENABLE_OTP = import.meta.env.VITE_ENABLE_OTP !== 'false'; // پیش‌فرض: true

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalCount, clearCart } = useCart();

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(ENABLE_OTP ? 'auth' : 'form'); // 'auth' | 'form' | 'submitting'

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedItems = useMemo(() => items.map(it => ({
    id: it.id,
    name: it.name,
    unit_price: it.unitPrice || 0,
    quantity: it.quantity || 1,
    image: it.image || null
  })), [items]);

  useEffect(() => {
    // فقط وقتی در مرحله auth یا form هستیم و سبد خالی شده و در حال submit نیستیم، redirect کن
    // اگر در حال submit هستیم یا step submitting است، redirect نکن
    if (
      (step === 'auth' || step === 'form') && 
      (!items || items.length === 0) && 
      !isSubmitting &&
      step !== 'submitting'
    ) {
      navigate('/');
    }
  }, [items, navigate, step, isSubmitting]);

  useEffect(() => {
    (async () => {
      try {
        if (!ENABLE_OTP) {
          // اگر OTP غیرفعال باشه، مستقیماً به فرم برو
          setStep('form');
          setAuthChecked(true);
          return;
        }

        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          setStep('form');
          // Try to preload profile
          try {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
            if (profile) {
              setFullName(profile.name || '');
            }
          } catch {
            // Preloading پروفایل اختیاری است؛ خطا را نادیده می‌گیریم.
          }
        }
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const handleSendOtp = async () => {
    setAuthError('');
    try {
      setIsSendingOtp(true);
      const response = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'خطا در ارسال کد.');
      }

      setOtpSent(true);
    } catch (err) {
      setAuthError(err?.message || 'خطا در ارسال کد.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError('');
    try {
      setIsVerifyingOtp(true);

      const verifyResponse = await fetch(`${API_BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code: otpCode }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyResult?.success) {
        throw new Error(verifyResult?.error || 'کد وارد شده صحیح نیست.');
      }

      const { pseudoEmail, verificationType } = verifyResult;

      const { data: supabaseData, error } = await supabase.auth.verifyOtp({
        email: pseudoEmail,
        token: otpCode,
        type: verificationType || 'magiclink',
      });
      if (error) throw error;

      if (supabaseData?.user) {
        setUser(supabaseData.user);
        setStep('form');
        // Ensure profile exists
        try {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', supabaseData.user.id)
            .maybeSingle();
          if (!existing) {
            await supabase.from('profiles').insert({ id: supabaseData.user.id, phone });
          }
        } catch {
          // عدم موفقیت در ایجاد پروفایل مانع ادامه فرآیند نمی‌شود.
        }
      }
    } catch (err) {
      setAuthError(err?.message || 'کد وارد شده صحیح نیست.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleLogout = async () => {
    setAuthError('');
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setStep('auth');
      setOtpSent(false);
      setOtpCode('');
      setPhone('');
      setFullName('');
      setAddress('');
      setPostalCode('');
      setSubmitError('');
      setAuthError('برای ورود مجدد لطفاً شماره موبایل خود را وارد کنید.');
    } catch (err) {
      setAuthError(err?.message || 'خروج از سیستم با خطا مواجه شد.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) return 'وارد کردن نام و نام خانوادگی الزامی است';
    if (!address.trim()) return 'وارد کردن آدرس الزامی است';
    if (!postalCode.match(/^\d{10}$/)) return 'کد پستی باید 10 رقم باشد';
    return '';
  };

  const handleSubmitOrder = async () => {
    const err = validateForm();
    if (err) { setSubmitError(err); return; }
    setSubmitError('');
    setIsSubmitting(true);
    try {
      // اگر OTP غیرفعال باشه، user_id رو NULL می‌ذاریم
      let currentUser = null;
      if (ENABLE_OTP) {
        const { data: auth } = await supabase.auth.getUser();
        currentUser = auth?.user;
        if (!currentUser) throw new Error('برای نهایی کردن خرید باید وارد شوید');
        
        // Upsert profile details (فقط وقتی OTP فعاله)
        await supabase.from('profiles').upsert({ id: currentUser.id, name: fullName, phone: currentUser.phone || phone });
      }

      // Create order
      const orderPayload = {
        user_id: currentUser?.id || null, // اگر OTP غیرفعال باشه، NULL می‌ذاریم
        total_amount: Math.round(totalPrice || 0),
        payment_status: 'pending',
        full_name: fullName,
        address,
        postal_code: postalCode,
        phone: phone || '09000000000'
      };

      const { data: orderRows, error: orderErr } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .limit(1);
      if (orderErr) throw orderErr;
      const orderId = orderRows?.[0]?.id;

      // Insert order items
      const itemsPayload = normalizedItems.map(it => ({
        order_id: orderId,
        product_id: typeof it.id === 'number' ? it.id : null,
        name_snapshot: it.name,
        unit_price: Math.round(it.unit_price || 0),
        quantity: it.quantity
      }));
      const { error: itemsErr } = await supabase.from('order_items').insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      // ذخیره اطلاعات سفارش قبل از navigate
      const orderDataForPayment = {
        orderId,
        totalAmount: Math.round(totalPrice || 0),
        items: normalizedItems,
        customerInfo: {
          name: fullName,
          phone: currentUser?.phone || phone,
          address,
          postalCode,
        },
        description: `پرداخت سفارش #${orderId}`,
      };

      // تغییر step به submitting تا useEffect redirect نکند
      setStep('submitting');

      // هدایت به صفحه پرداخت
      navigate('/payment/form', {
        state: { orderData: orderDataForPayment },
        replace: true,
      });

      // پاک کردن سبد خرید با تاخیر کوچک تا navigate کامل بشه
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (err) {
      setSubmitError(err?.message || 'خطا در ثبت سفارش');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">در حال بررسی...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Breadcrumbs />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">تکمیل سفارش</h1>

        {step === 'auth' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">ورود به حساب کاربری</h2>
                <p className="text-gray-600 text-sm">برای ادامه خرید لطفاً وارد شوید</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره موبایل</label>
                  <input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="09123456789" 
                    dir="ltr" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  />
                </div>
                
                {!otpSent ? (
                  <button 
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !phone}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg py-3 font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isSendingOtp ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        در حال ارسال...
                      </>
                    ) : (
                      'ارسال کد تایید'
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">کد تایید</label>
                      <input 
                        value={otpCode} 
                        onChange={(e) => setOtpCode(e.target.value)} 
                        placeholder="کد ۶ رقمی" 
                        dir="ltr" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || !otpCode}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg py-3 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          در حال بررسی...
                        </>
                      ) : (
                        'تایید و ادامه'
                      )}
                    </button>
                  </div>
                )}
                
                {authError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {authError}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-2xl shadow-lg p-4 mb-4 gap-3">
              <div>
                <p className="text-sm text-gray-500">وارد شده با شماره</p>
                <p className="text-base font-semibold text-gray-800" dir="ltr">
                  {user?.phone || phone}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isLoggingOut ? 'در حال خروج...' : 'خروج از حساب'}
              </button>
            </div>
            {/* محصولات سبد خرید */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    ورود با شماره {user?.phone || phone}
                  </p>
                  <p className="text-sm text-blue-600">
                    برای ورود با شماره دیگر، ابتدا از حساب خارج شوید.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-colors"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال خروج...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                      </svg>
                      خروج از حساب
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  محصولات سبد خرید ({totalCount} کالا)
                </h2>
                
                <div className="space-y-3">
                  {normalizedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                      {/* تصویر محصول */}
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* مشخصات محصول */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs md:text-sm">
                          <div className="flex flex-col">
                            <span className="text-gray-500">قیمت واحد</span>
                            <span className="font-semibold text-gray-700">
                              {formatCurrency(item.unit_price)} تومان
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-500">تعداد</span>
                            <span className="font-semibold text-gray-700">{item.quantity} عدد</span>
                          </div>
                          <div className="flex flex-col col-span-2 md:col-span-1">
                            <span className="text-gray-500">جمع</span>
                            <span className="font-bold text-blue-600 text-sm md:text-base">
                              {formatCurrency(item.unit_price * item.quantity)} تومان
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* فرم اطلاعات */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  اطلاعات ارسال
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی *</label>
                    <input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="نام کامل خود را وارد کنید"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل *</label>
                    <textarea 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      rows={3} 
                      placeholder="آدرس دقیق خود را وارد کنید"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">کد پستی *</label>
                    <input 
                      value={postalCode} 
                      onChange={(e) => setPostalCode(e.target.value)} 
                      dir="ltr" 
                      placeholder="1234567890"
                      maxLength={10}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    />
                    <p className="text-xs text-gray-500 mt-1">کد پستی ۱۰ رقمی</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                    <input 
                      value={user?.phone || phone} 
                      readOnly 
                      dir="ltr" 
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600 cursor-not-allowed" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  خلاصه سفارش
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <span>تعداد کالا:</span>
                    <span className="font-semibold">{totalCount} عدد</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <span>جمع کل محصولات:</span>
                    <span className="font-semibold">{formatCurrency(totalPrice)} تومان</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-600 text-sm">
                    <span>هزینه ارسال:</span>
                    <span className="font-semibold text-green-600">رایگان</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-bold text-lg">مبلغ قابل پرداخت:</span>
                      <span className="text-blue-600 font-bold text-xl">{formatCurrency(totalPrice)} تومان</span>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                    {submitError}
                  </div>
                )}

                <button 
                  disabled={isSubmitting} 
                  onClick={handleSubmitOrder} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      در حال ثبت سفارش...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      پرداخت و ثبت نهایی سفارش
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>پرداخت امن و مطمئن</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;


