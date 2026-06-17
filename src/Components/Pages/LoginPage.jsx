import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Breadcrumbs from '../Common/Breadcrumbs';
import LoginIcon from '@mui/icons-material/Login';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    // بررسی اینکه آیا کاربر قبلاً لاگین کرده
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // بررسی اینکه آیا این کاربر ادمین است یا نه
          const userEmail = session.user.email?.toLowerCase() || '';
          const isAdmin = userEmail === 'admin@lentshop.com';
          
          if (isAdmin) {
            // اگر ادمین است، session را پاک کن و به صفحه اصلی بفرست
            await supabase.auth.signOut();
            navigate('/');
            return;
          }
          
          // اگر کاربر عادی است، به حساب کاربری برو
          navigate('/account');
        }
      } catch (error) {
        console.error('خطا در بررسی احراز هویت:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  const checkUserExists = async (phoneNumber) => {
    setCheckingUser(true);
    setAuthError('');
    
    try {
      // استفاده از API برای بررسی وجود کاربر
      const response = await fetch(`${API_BASE_URL}/api/auth/check-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setIsNewUser(result.isNew);
        return result.isNew;
      } else {
        // اگر خطا بود، فرض می‌کنیم کاربر جدید است
        setIsNewUser(true);
        return true;
      }
    } catch (error) {
      console.error('خطا در بررسی کاربر:', error);
      // در صورت خطا، فرض می‌کنیم کاربر جدید است
      setIsNewUser(true);
      return true;
    } finally {
      setCheckingUser(false);
    }
  };

  const handleSendOtp = async () => {
    setAuthError('');
    
    if (!phone.trim()) {
      setAuthError('لطفاً شماره موبایل را وارد کنید');
      return;
    }

    // بررسی فرمت شماره
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      setAuthError('شماره موبایل معتبر نیست. لطفاً شماره را به فرم 09123456789 وارد کنید');
      return;
    }

    try {
      setIsSendingOtp(true);

      // بررسی اینکه آیا کاربر قبلاً ثبت‌نام کرده
      const isNew = await checkUserExists(phone);
      
      if (!isNew) {
        // کاربر قبلاً ثبت‌نام کرده - فقط ورود
        setIsNewUser(false);
      } else {
        // کاربر جدید - ثبت‌نام
        setIsNewUser(true);
      }

      // ارسال OTP
      const response = await fetch(`${API_BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'ارسال کد تایید ناموفق بود');
      }

      setOtpSent(true);
      setAuthError('');
    } catch (err) {
      console.error('خطا در ارسال OTP:', err);
      setAuthError(err?.message || 'خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError('');
    
    if (!otpCode.trim()) {
      setAuthError('لطفاً کد تایید را وارد کنید');
      return;
    }

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
        // بررسی اینکه آیا این کاربر ادمین است یا نه
        const userEmail = supabaseData.user.email?.toLowerCase() || '';
        const isAdmin = userEmail === 'admin@lentshop.com';
        
        if (isAdmin) {
          // اگر ادمین است، از session خارج کن و خطا بده
          await supabase.auth.signOut();
          setAuthError('این شماره برای ورود به پنل ادمین مجاز نیست. لطفاً از صفحه ورود ادمین استفاده کنید.');
          return;
        }

        // Ensure profile exists
        try {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', supabaseData.user.id)
            .maybeSingle();
          
          if (!existing) {
            await supabase.from('profiles').insert({ 
              id: supabaseData.user.id, 
              phone: phone.replace(/[^0-9]/g, ''),
            });
          }
        } catch (profileError) {
          console.error('خطا در ایجاد پروفایل:', profileError);
          // ادامه می‌دهیم حتی اگر پروفایل ایجاد نشد
        }

        // بعد از ورود موفق، به مقصد مورد نظر برو یا حساب کاربری (فقط برای مشتری‌ها)
        const from = location.state?.from?.pathname || '/account';
        navigate(from);
      }
    } catch (err) {
      console.error('خطا در تایید OTP:', err);
      setAuthError(err?.message || 'کد وارد شده صحیح نیست.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleBack = () => {
    if (otpSent) {
      setOtpSent(false);
      setOtpCode('');
      setAuthError('');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Breadcrumbs />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <button
              onClick={handleBack}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowBackIcon />
            </button>
            <LoginIcon className="text-5xl text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {isNewUser ? 'ثبت‌نام' : 'ورود'}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {isNewUser 
                ? 'برای ثبت‌نام، شماره موبایل خود را وارد کنید'
                : 'برای ورود، شماره موبایل خود را وارد کنید'
              }
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {authError}
            </div>
          )}

          {!otpSent ? (
            /* Phone Input Form */
            <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  شماره موبایل
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="09123456789"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right"
                    disabled={isSendingOtp || checkingUser}
                    maxLength={11}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  کد تایید به این شماره ارسال خواهد شد
                </p>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp || checkingUser || !phone.trim()}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkingUser ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>در حال بررسی...</span>
                  </>
                ) : isSendingOtp ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <span>ارسال کد تایید</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  کد تایید
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="کد 6 رقمی"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
                  disabled={isVerifyingOtp}
                  maxLength={6}
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  کد تایید به شماره {phone} ارسال شد
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp || !otpCode.trim() || otpCode.length < 4}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifyingOtp ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>در حال تایید...</span>
                  </>
                ) : (
                  <span>تایید و {isNewUser ? 'ثبت‌نام' : 'ورود'}</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                تغییر شماره موبایل
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

