import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Breadcrumbs from '../Common/Breadcrumbs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const UserAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  
  // Order Tracking States
  const [orderId, setOrderId] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedOrderData, setTrackedOrderData] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchOrders(session.access_token);
        } else {
          navigate('/checkout');
        }
      } catch (error) {
        console.error('خطا در بررسی احراز هویت:', error);
        navigate('/checkout');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (session.access_token) {
          fetchOrders(session.access_token);
        }
      } else {
        navigate('/checkout');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchOrders = async (accessToken) => {
    setLoadingOrders(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrders(result.data.orders || []);
      } else {
        setError(result.error || 'خطا در دریافت سفارشات');
      }
    } catch (err) {
      console.error('خطا در دریافت سفارشات:', err);
      setError('خطا در اتصال به سرور');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('خطا در خروج:', error);
    }
  };

  const formatPrice = (price) => {
    try {
      if (price === null || price === undefined) return '0';
      const numPrice = typeof price === 'number' ? price : parseFloat(price);
      if (isNaN(numPrice) || !isFinite(numPrice)) return '0';
      return new Intl.NumberFormat('fa-IR').format(numPrice);
    } catch (error) {
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'confirmed': 'تایید شده',
      'preparing': 'آماده سازی',
      'shipped': 'ارسال',
      'delivered': 'تحویل',
    };
    return statusMap[status] || status;
  };

  // Order Tracking Handler
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setTrackingError('لطفاً شماره سفارش یا کد پیگیری را وارد کنید');
      return;
    }

    setTrackingLoading(true);
    setTrackingError('');
    setTrackedOrderData(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setTrackingError('لطفاً دوباره وارد شوید');
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
        setTrackedOrderData(result.data);
        setTrackingError('');
      } else {
        setTrackingError(result.error || 'سفارش یافت نشد');
        setTrackedOrderData(null);
      }
    } catch (err) {
      console.error('خطا در پیگیری سفارش:', err);
      setTrackingError('خطا در اتصال به سرور. لطفاً دوباره تلاش کنید.');
      setTrackedOrderData(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleClearTracking = () => {
    setOrderId('');
    setTrackedOrderData(null);
    setTrackingError('');
  };

  // محاسبه آمار
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const confirmedOrders = orders.filter(o => o.payment_status === 'confirmed' || o.payment_status === 'delivered').length;
  const confirmedAmount = orders
    .filter(o => o.payment_status === 'confirmed' || o.payment_status === 'delivered')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Breadcrumbs />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <AccountCircleIcon className="text-5xl text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">حساب کاربری</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {user?.email || 'کاربر'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <LogoutIcon />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Order Tracking Section - بخش پیگیری سفارش */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">پیگیری سفارش</h2>
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="شماره سفارش یا کد پیگیری را وارد کنید"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right"
                disabled={trackingLoading}
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {trackingLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>جستجو...</span>
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    <span>پیگیری</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {trackingError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
              {trackingError}
            </div>
          )}

          {/* Tracked Order Details */}
          {trackedOrderData && (
            <div className="mt-6 bg-gray-50 rounded-xl shadow-md p-4 md:p-6">
              {/* Header with Clear Button */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  جزئیات سفارش
                </h3>
                <button
                  onClick={handleClearTracking}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="بستن"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                <div className="bg-white p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">شماره سفارش</p>
                  <p className="text-sm md:text-base font-bold text-gray-800">#{trackedOrderData.order.id}</p>
                </div>
                <div className="bg-white p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">وضعیت</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(trackedOrderData.order.payment_status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(trackedOrderData.order.payment_status)}`}>
                      {trackedOrderData.order.payment_status_label}
                    </span>
                  </div>
                </div>
                {trackedOrderData.order.payment_ref_id && (
                  <div className="bg-white p-2 md:p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">کد پیگیری</p>
                    <p className="text-sm md:text-base font-bold text-gray-800">{trackedOrderData.order.payment_ref_id}</p>
                  </div>
                )}
                <div className="bg-white p-2 md:p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">تاریخ</p>
                  <p className="text-xs md:text-sm font-medium text-gray-800">{formatDate(trackedOrderData.order.created_at)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-bold text-gray-800 mb-2">اطلاعات خریدار</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-600">نام:</span>
                    <span className="mr-2 font-medium text-gray-800">{trackedOrderData.order.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">تلفن:</span>
                    <span className="mr-2 font-medium text-gray-800">{trackedOrderData.order.phone}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">آدرس:</span>
                    <span className="mr-2 font-medium text-gray-800">{trackedOrderData.order.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">کد پستی:</span>
                    <span className="mr-2 font-medium text-gray-800">{trackedOrderData.order.postal_code}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {trackedOrderData.items && trackedOrderData.items.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">اقلام سفارش ({trackedOrderData.total_items} عدد)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="bg-white">
                          <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-right text-xs md:text-sm font-bold text-gray-700">نام محصول</th>
                          <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-center text-xs md:text-sm font-bold text-gray-700">تعداد</th>
                          <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm font-bold text-gray-700">قیمت واحد</th>
                          <th className="border border-gray-300 px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm font-bold text-gray-700">جمع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trackedOrderData.items.map((item, index) => (
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
                            {formatPrice(trackedOrderData.order.total_amount)} تومان
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">کل سفارشات</p>
                <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
              </div>
              <ShoppingBagIcon className="text-4xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">مبلغ کل</p>
                <p className="text-2xl font-bold text-gray-800">{formatPrice(totalAmount)} تومان</p>
              </div>
              <ShoppingBagIcon className="text-4xl text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">سفارشات تایید شده</p>
                <p className="text-2xl font-bold text-gray-800">{confirmedOrders}</p>
              </div>
              <CheckCircleIcon className="text-4xl text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">مبلغ تایید شده</p>
                <p className="text-2xl font-bold text-gray-800">{formatPrice(confirmedAmount)} تومان</p>
              </div>
              <CheckCircleIcon className="text-4xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">سفارشات من</h2>
            <button
              onClick={async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                  fetchOrders(session.access_token);
                }
              }}
              disabled={loadingOrders}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
            >
              {loadingOrders ? 'در حال به‌روزرسانی...' : '🔄 به‌روزرسانی'}
            </button>
          </div>

          {loadingOrders ? (
            <div className="text-center py-8">
              <p className="text-gray-600">در حال بارگذاری سفارشات...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBagIcon className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">هنوز سفارشی ثبت نکرده‌اید</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                شروع خرید
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-800">سفارش #{order.id}</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.payment_status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status_label || getStatusLabel(order.payment_status)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">تاریخ:</span> {formatDate(order.created_at)}
                        </div>
                        <div>
                          <span className="font-medium">تعداد اقلام:</span> {order.items_count} عدد
                        </div>
                        <div>
                          <span className="font-medium">مبلغ:</span> {formatPrice(order.total_amount)} تومان
                        </div>
                      </div>
                      {order.payment_ref_id && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">کد پیگیری:</span>
                          <span className="mr-2 font-mono text-blue-600">{order.payment_ref_id}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      مشاهده جزئیات
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">جزئیات سفارش #{selectedOrder.id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">وضعیت سفارش</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedOrder.payment_status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status_label || getStatusLabel(selectedOrder.payment_status)}
                    </span>
                  </div>
                </div>
                {selectedOrder.payment_ref_id && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">کد پیگیری</p>
                    <p className="text-lg font-bold text-gray-800 font-mono">{selectedOrder.payment_ref_id}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">تاریخ سفارش</p>
                  <p className="text-lg font-medium text-gray-800">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">مبلغ کل</p>
                  <p className="text-lg font-bold text-blue-600">{formatPrice(selectedOrder.total_amount)} تومان</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">اطلاعات خریدار</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">نام:</span>
                    <span className="mr-2 font-medium text-gray-800">{selectedOrder.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">تلفن:</span>
                    <span className="mr-2 font-medium text-gray-800">{selectedOrder.phone}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">آدرس:</span>
                    <span className="mr-2 font-medium text-gray-800">{selectedOrder.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">کد پستی:</span>
                    <span className="mr-2 font-medium text-gray-800">{selectedOrder.postal_code}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">شرکت ارسال کننده:</span>
                    <span className="mr-2 font-medium text-gray-800">
                      {selectedOrder.shipping_company === 'tipax' ? 'تیپاکس (پس کرایه)' : 'پست'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-3">اقلام سفارش ({selectedOrder.items_count} عدد)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-right text-sm font-bold text-gray-700">نام محصول</th>
                          <th className="border border-gray-300 px-4 py-2 text-center text-sm font-bold text-gray-700">تعداد</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold text-gray-700">قیمت واحد</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold text-gray-700">جمع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={item.id || index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-800">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-800">{item.quantity}</td>
                            <td className="border border-gray-300 px-4 py-2 text-left text-sm text-gray-800">{formatPrice(item.unit_price)} تومان</td>
                            <td className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-800">{formatPrice(item.total_price)} تومان</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-blue-50">
                          <td colSpan="3" className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-800">
                            مجموع کل:
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-blue-600">
                            {formatPrice(selectedOrder.total_amount)} تومان
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;

