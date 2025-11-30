import React, { useState } from 'react';
import { backupDatabase, backupProducts, backupOrdersAndCustomers } from '../../backup_database';
import DownloadIcon from '@mui/icons-material/Download';
import StorageIcon from '@mui/icons-material/Storage';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';

const BackupManager = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBackup = async (backupType) => {
    try {
      setLoading(true);
      setMessage('در حال آماده‌سازی بک‌آپ...');

      let result;
      switch (backupType) {
        case 'full':
          result = await backupDatabase();
          setMessage(`بک‌آپ کامل با موفقیت انجام شد! ${Object.keys(result.tables).length} جدول بک‌آپ شد.`);
          break;
        case 'products':
          result = await backupProducts();
          setMessage(`بک‌آپ محصولات با موفقیت انجام شد! ${result.products.length} محصول بک‌آپ شد.`);
          break;
        case 'customers':
          result = await backupOrdersAndCustomers();
          setMessage(`بک‌آپ مشتریان با موفقیت انجام شد! ${result.orders.length} سفارش و ${result.profiles.length} مشتری بک‌آپ شد.`);
          break;
        default:
          throw new Error('نوع بک‌آپ نامعتبر است');
      }

    } catch (error) {
      console.error('خطا در بک‌آپ:', error);
      setMessage(`خطا در بک‌آپ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">مدیریت بک‌آپ دیتابیس</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('خطا') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* بک‌آپ کامل */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <StorageIcon className="text-4xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-3">بک‌آپ کامل</h3>
          <p className="text-gray-600 mb-4 text-sm">
            بک‌آپ تمام جداول شامل محصولات، برندها، سفارشات و مشتریان
          </p>
          <button
            onClick={() => handleBackup('full')}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon />
            {loading ? 'در حال بک‌آپ...' : 'بک‌آپ کامل'}
          </button>
        </div>

        {/* بک‌آپ محصولات */}
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <ShoppingCartIcon className="text-4xl text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-3">بک‌آپ محصولات</h3>
          <p className="text-gray-600 mb-4 text-sm">
            بک‌آپ فقط محصولات، برندها و دسته‌بندی‌ها
          </p>
          <button
            onClick={() => handleBackup('products')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon />
            {loading ? 'در حال بک‌آپ...' : 'بک‌آپ محصولات'}
          </button>
        </div>

        {/* بک‌آپ مشتریان */}
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <PeopleIcon className="text-4xl text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-3">بک‌آپ مشتریان</h3>
          <p className="text-gray-600 mb-4 text-sm">
            بک‌آپ سفارشات، مشتریان و اطلاعات خرید
          </p>
          <button
            onClick={() => handleBackup('customers')}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon />
            {loading ? 'در حال بک‌آپ...' : 'بک‌آپ مشتریان'}
          </button>
        </div>
      </div>

      {/* راهنمای استفاده */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">راهنمای استفاده</h3>
        <div className="space-y-3 text-sm text-gray-600 text-right">
          <p>• <strong>بک‌آپ کامل:</strong> تمام اطلاعات دیتابیس را بک‌آپ می‌گیرد</p>
          <p>• <strong>بک‌آپ محصولات:</strong> فقط اطلاعات محصولات و برندها</p>
          <p>• <strong>بک‌آپ مشتریان:</strong> فقط سفارشات و اطلاعات مشتریان</p>
          <p>• فایل‌های بک‌آپ به صورت JSON دانلود می‌شوند</p>
          <p>• تاریخ بک‌آپ در نام فایل ذخیره می‌شود</p>
        </div>
      </div>

      {/* نکات مهم */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-yellow-800 mb-2 text-right">⚠️ نکات مهم</h4>
        <ul className="text-sm text-yellow-700 text-right space-y-1">
          <li>• بک‌آپ‌ها را در مکان امن ذخیره کنید</li>
          <li>• بک‌آپ منظم (هفتگی) انجام دهید</li>
          <li>• قبل از تغییرات مهم حتماً بک‌آپ بگیرید</li>
          <li>• فایل‌های بک‌آپ را رمزگذاری کنید</li>
        </ul>
      </div>
    </div>
  );
};

export default BackupManager;
