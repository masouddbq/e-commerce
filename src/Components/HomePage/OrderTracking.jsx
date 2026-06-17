import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('خطا در بررسی احراز هویت:', error);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const formatPrice = (price) => {
    try {
      if (price === null || price === undefined) return '0';
      const numPrice = typeof price === 'number' ? price : parseFloat(price);
      if (isNaN(numPrice) || !isFinite(numPrice)) return '0';
      return new Intl.NumberFormat('fa-IR').format(numPrice);
    } catch (error) {
      console.warn('خطا در فرمت کردن قیمت:', price, error);
      return '0';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="text-green-500" />;
      case 'preparing':
        return <PendingIcon className="text-blue-500" />;
      case 'shipped':
        return <LocalShippingIcon className="text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="text-emerald-600" />;
      case 'cancelled':
        return <CancelIcon className="text-red-500" />;
      default:
        return <PendingIcon className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('لطفاً ابتدا وارد شوید');
      navigate('/checkout');
      return;
    }
    
    if (!orderId.trim()) {
      setError('لطفاً شماره سفارش یا کد پیگیری را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      // دریافت access token از Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('لطفاً دوباره وارد شوید');
        return;
      }

      // تشخیص اینکه orderId است یا trackingId (کد پیگیری معمولاً حروف دارد)
      const isTrackingId = /[a-zA-Z]/.test(orderId);
      const queryParam = isTrackingId ? `trackingId=${encodeURIComponent(orderId)}` : `orderId=${encodeURIComponent(orderId)}`;
      
      const response = await fetch(`${API_BASE_URL}/api/orders/track?${queryParam}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setOrderData(result.data);
        setError('');
      } else {
        setError(result.error || 'سفارش یافت نشد');
        setOrderData(null);
      }
    } catch (err) {
      console.error('خطا در پیگیری سفارش:', err);
      setError('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOrderId('');
    setOrderData(null);
    setError('');
  };

  if (loadingAuth) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // اگر کاربر ورود نکرده، نمایش فرم کوچک
  if (!user) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-row gap-2 sm:gap-3 items-center justify-center">
            {/* بخش پیگیری سفارش */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-2 sm:p-4 max-w-md">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2 text-center">پیگیری سفارش</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 text-center hidden sm:block">برای پیگیری سفارش وارد شوید</p>
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/account' } } })}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
              >
                ورود برای پیگیری
              </button>
            </div>
            
            {/* بخش ورود به حساب کاربری */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-2 sm:p-4 max-w-md">
              <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2 text-center">حساب کاربری</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 text-center hidden sm:block">ورود یا ثبت‌نام در سایت</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-1 sm:gap-2"
            >
                <LoginIcon className="text-xs sm:text-base" />
                <span className="text-xs sm:text-sm">ورود / ثبت‌نام</span>
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* بخش پیگیری سفارش و ورود به حساب کاربری در یک سطر */}
        <div className="flex flex-row gap-2 sm:gap-3 items-start justify-center mb-4">
          {/* بخش پیگیری سفارش */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-2 sm:p-4 max-w-md">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2 text-center">پیگیری سفارش</h3>
            <form onSubmit={handleTrack} className="space-y-1.5 sm:space-y-2">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="شماره سفارش یا کد پیگیری"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right"
                disabled={loading}
              />
            <button
              type="submit"
              disabled={loading}
                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
            >
              {loading ? (
                <>
                    <span className="animate-spin text-xs sm:text-sm">⏳</span>
                    <span className="text-xs sm:text-sm">جستجو...</span>
                </>
              ) : (
                <>
                    <SearchIcon className="text-xs sm:text-base" />
                    <span className="text-xs sm:text-sm">پیگیری</span>
                </>
              )}
            </button>
            </form>
          </div>
          
          {/* بخش ورود به حساب کاربری */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-2 sm:p-4 max-w-md">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2 text-center">حساب کاربری</h3>
            <p className="text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 text-center hidden sm:block">مشاهده و مدیریت سفارشات</p>
            <button
              onClick={() => navigate('/account')}
              className="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors inline-flex items-center justify-center gap-1 sm:gap-2"
            >
              <LoginIcon className="text-xs sm:text-base" />
              <span className="text-xs sm:text-sm">ورود به حساب کاربری</span>
            </button>
          </div>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            {/* Header with Clear Button */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                جزئیات سفارش
              </h3>
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="بستن"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">شماره سفارش</p>
                <p className="text-sm md:text-base font-bold text-gray-800">#{orderData.order.id}</p>
              </div>
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">وضعیت</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(orderData.order.payment_status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(orderData.order.payment_status)}`}>
                    {orderData.order.payment_status_label}
                  </span>
                </div>
              </div>
              {orderData.order.payment_ref_id && (
                <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">کد پیگیری</p>
                  <p className="text-sm md:text-base font-bold text-gray-800">{orderData.order.payment_ref_id}</p>
                </div>
              )}
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">تاریخ</p>
                <p className="text-xs md:text-sm font-medium text-gray-800">{formatDate(orderData.order.created_at)}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-bold text-gray-800 mb-2">اطلاعات خریدار</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                <div>
                  <span className="text-gray-600">نام:</span>
                  <span className="mr-2 font-medium text-gray-800">{orderData.order.full_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">تلفن:</span>
                  <span className="mr-2 font-medium text-gray-800">{orderData.order.phone}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600">آدرس:</span>
                  <span className="mr-2 font-medium text-gray-800">{orderData.order.address}</span>
                </div>
                <div>
                  <span className="text-gray-600">کد پستی:</span>
                  <span className="mr-2 font-medium text-gray-800">{orderData.order.postal_code}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-800 mb-2">اقلام سفارش ({orderData.total_items} عدد)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-right text-xs md:text-sm font-bold text-gray-700">نام محصول</th>
                        <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-center text-xs md:text-sm font-bold text-gray-700">تعداد</th>
                        <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm font-bold text-gray-700">قیمت واحد</th>
                        <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm font-bold text-gray-700">جمع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item, index) => (
                        <tr key={item.id || index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-right text-xs md:text-sm text-gray-800">{item.name}</td>
                          <td className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-center text-xs md:text-sm text-gray-800">{item.quantity}</td>
                          <td className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm text-gray-800">{formatPrice(item.unit_price)} تومان</td>
                          <td className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm font-medium text-gray-800">{formatPrice(item.total_price)} تومان</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50">
                        <td colSpan="3" className="border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-right text-xs md:text-sm font-bold text-gray-800">
                          مجموع کل:
                        </td>
                        <td className="border border-gray-300 px-2 py-2 md:px-3 md:py-2 text-left text-xs md:text-sm font-bold text-blue-600">
                          {formatPrice(orderData.order.total_amount)} تومان
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

