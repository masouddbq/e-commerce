import React, { useState, useEffect } from 'react';

const SalesReport = () => {
  const [activePeriod, setActivePeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchReport();
  }, [activePeriod, selectedDate, selectedMonth, selectedYear]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = '';
      if (activePeriod === 'daily') {
        url = `${API_BASE_URL}/api/sales/daily?date=${selectedDate}`;
      } else if (activePeriod === 'weekly') {
        url = `${API_BASE_URL}/api/sales/weekly`;
      } else if (activePeriod === 'monthly') {
        url = `${API_BASE_URL}/api/sales/monthly?year=${selectedYear}&month=${selectedMonth}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setReportData(result.data);
      } else {
        setError(result.error || 'خطا در دریافت گزارش');
      }
    } catch (err) {
      console.error('خطا در دریافت گزارش:', err);
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    try {
      // اطمینان از اینکه price یک عدد معتبر است
      if (price === null || price === undefined) {
        return '0';
      }
      
      const numPrice = typeof price === 'number' 
        ? price 
        : (typeof price === 'string' ? parseFloat(price) : 0);
      
      if (isNaN(numPrice) || !isFinite(numPrice)) {
        return '0';
      }
      
      return new Intl.NumberFormat('fa-IR').format(numPrice);
    } catch (error) {
      console.warn('خطا در فرمت کردن قیمت:', price, error);
      return '0';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'confirmed': { text: 'تایید شده', color: 'bg-green-100 text-green-800' },
      'preparing': { text: 'آماده سازی', color: 'bg-blue-100 text-blue-800' },
      'shipped': { text: 'ارسال', color: 'bg-purple-100 text-purple-800' },
      'delivered': { text: 'تحویل', color: 'bg-emerald-100 text-emerald-800' },
    };
    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 text-right mb-4">گزارش فروش</h2>
        <p className="text-xs md:text-sm text-gray-600 text-right">مشاهده و مدیریت گزارش‌های فروش روزانه، هفتگی و ماهانه</p>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={() => setActivePeriod('daily')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePeriod === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            فروش روزانه
          </button>
          <button
            onClick={() => setActivePeriod('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePeriod === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            فروش هفتگی
          </button>
          <button
            onClick={() => setActivePeriod('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            فروش ماهانه
          </button>
        </div>

        {/* Date/Period Selectors */}
        {activePeriod === 'daily' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
              انتخاب تاریخ:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
            />
          </div>
        )}

        {activePeriod === 'monthly' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                سال:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                ماه:
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {reportData && reportData.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 text-right mb-1">کل سفارشات</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatPrice(reportData.stats?.total_orders ?? 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 text-right mb-1">مبلغ کل</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(reportData.stats?.total_amount ?? 0)} تومان
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 text-right mb-1">سفارشات پرداخت شده</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(reportData.stats?.paid_orders ?? 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 text-right mb-1">مبلغ پرداخت شده</div>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(reportData.stats?.paid_amount ?? 0)} تومان
            </div>
          </div>
        </div>
      )}

      {/* Empty State - اگر سفارشی وجود نداشت */}
      {reportData && reportData.orders && reportData.orders.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">گزارش فروش خالی است</h3>
          <p className="text-gray-600 mb-4">در این بازه زمانی سفارشی ثبت نشده است</p>
          <p className="text-sm text-gray-500">لطفاً بازه زمانی دیگری را انتخاب کنید یا منتظر ثبت سفارش جدید بمانید</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال دریافت گزارش...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-right">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      {reportData && reportData.orders && !loading && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 text-right">
              لیست سفارشات ({reportData.orders.length})
            </h3>
          </div>
          {reportData.orders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">📭</div>
              <p className="text-gray-600 font-medium">در این بازه زمانی سفارشی ثبت نشده است</p>
              <p className="text-sm text-gray-500 mt-2">لطفاً بازه زمانی دیگری را انتخاب کنید</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">شماره سفارش</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">نام خریدار</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">تعداد اقلام</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">مبلغ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">وضعیت</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">شماره پیگیری</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">تاریخ</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">جزئیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-center">{formatPrice(order.items_count || 0)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(order.total_amount || 0)} تومان</td>
                      <td className="px-4 py-3">
                        <OrderStatusEditor 
                          order={order} 
                          onStatusChange={fetchReport}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{order.payment_ref_id || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3">
                        <OrderDetailsModal order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Modal برای نمایش جزئیات سفارش
const OrderDetailsModal = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price) => {
    try {
      // اطمینان از اینکه price یک عدد معتبر است
      if (price === null || price === undefined) {
        return '0';
      }
      
      const numPrice = typeof price === 'number' 
        ? price 
        : (typeof price === 'string' ? parseFloat(price) : 0);
      
      if (isNaN(numPrice) || !isFinite(numPrice)) {
        return '0';
      }
      
      return new Intl.NumberFormat('fa-IR').format(numPrice);
    } catch (error) {
      console.warn('خطا در فرمت کردن قیمت:', price, error);
      return '0';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        مشاهده
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        مشاهده
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 text-right">
                  جزئیات سفارش #{order.id}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">نام خریدار:</label>
                    <p className="text-sm text-gray-900">{order.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">تلفن:</label>
                    <p className="text-sm text-gray-900">{order.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">مبلغ کل:</label>
                    <p className="text-sm text-gray-900 font-semibold">{formatPrice(order.total_amount || 0)} تومان</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">وضعیت:</label>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.payment_status === 'paid' ? 'پرداخت شده' :
                       order.payment_status === 'pending' ? 'در انتظار پرداخت' : order.payment_status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">آدرس:</label>
                    <p className="text-sm text-gray-900">{order.address || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">کد پستی:</label>
                    <p className="text-sm text-gray-900">{order.postal_code || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-right mb-1">شرکت ارسال کننده:</label>
                    <p className="text-sm text-gray-900 font-semibold">
                      {order.shipping_company === 'tipax' ? 'تیپاکس (پس کرایه)' : 'پست'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right mb-2">محصولات سفارش:</label>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold">نام محصول</th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold">تعداد</th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">قیمت واحد</th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">قیمت کل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-3 py-2 text-sm text-right">{item.name}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm text-center">{formatPrice(item.quantity)}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm text-left">{formatPrice(item.unit_price)} تومان</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm text-left font-semibold">{formatPrice(item.total_price)} تومان</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="border border-gray-300 px-3 py-2 text-sm text-center text-gray-500">
                              محصولی یافت نشد
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    بستن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// کامپوننت برای تغییر وضعیت سفارش
const OrderStatusEditor = ({ order, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.payment_status);

  const statusOptions = [
    { value: 'confirmed', label: 'تایید شده', color: 'bg-green-100 text-green-800' },
    { value: 'preparing', label: 'آماده سازی', color: 'bg-blue-100 text-blue-800' },
    { value: 'shipped', label: 'ارسال', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'تحویل', color: 'bg-emerald-100 text-emerald-800' },
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    if (!confirm(`آیا مطمئن هستید که می‌خواهید وضعیت سفارش #${order.id} را به "${statusOptions.find(s => s.value === newStatus)?.label}" تغییر دهید؟`)) {
      return;
    }

    try {
      setIsUpdating(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      
      console.log('[OrderStatusEditor] در حال تغییر وضعیت:', {
        orderId: order.id,
        newStatus,
        url: `${API_BASE_URL}/api/sales/orders/${order.id}/status`
      });
      
      const response = await fetch(`${API_BASE_URL}/api/sales/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_status: newStatus }),
      });

      console.log('[OrderStatusEditor] Response status:', response.status);
      const result = await response.json();
      console.log('[OrderStatusEditor] Response data:', result);

      if (response.ok && result.success) {
        setCurrentStatus(newStatus);
        // به‌روزرسانی لیست سفارشات
        if (onStatusChange) {
          onStatusChange();
        }
        alert('وضعیت سفارش با موفقیت تغییر یافت');
      } else {
        console.error('[OrderStatusEditor] خطا در تغییر وضعیت:', result);
        alert(`خطا در تغییر وضعیت: ${result.error || 'خطای نامشخص'}`);
      }
    } catch (error) {
      console.error('[OrderStatusEditor] خطا در تغییر وضعیت سفارش:', error);
      alert(`خطا در ارتباط با سرور: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className={`px-2 py-1 rounded text-xs font-semibold border ${
          statusOptions.find(s => s.value === currentStatus)?.color || 'bg-gray-100 text-gray-800'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {statusOptions.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      {isUpdating && (
        <span className="text-xs text-gray-500">در حال به‌روزرسانی...</span>
      )}
    </div>
  );
};

export default SalesReport;

