// اسکریپت بک‌آپ از دیتابیس Supabase

// تنظیمات Supabase - از فایل موجود استفاده می‌کنیم
import { supabase } from './lib/supabase';

// تابع بک‌آپ کامل
export const backupDatabase = async () => {
  try {
    console.log('شروع بک‌آپ دیتابیس...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      tables: {}
    };

    // لیست جداول مهم
    const importantTables = [
      'products',
      'brands', 
      'categories',
      'pad_brands',
      'orders',
      'order_items',
      'profiles'
    ];

    // بک‌آپ هر جدول
    for (const tableName of importantTables) {
      try {
        console.log(`بک‌آپ جدول ${tableName}...`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*');

        if (error) {
          console.error(`خطا در بک‌آپ جدول ${tableName}:`, error);
          backup.tables[tableName] = { error: error.message };
        } else {
          backup.tables[tableName] = data || [];
          console.log(`جدول ${tableName}: ${data?.length || 0} رکورد`);
        }
      } catch (err) {
        console.error(`خطا در بک‌آپ جدول ${tableName}:`, err);
        backup.tables[tableName] = { error: err.message };
      }
    }

    // ذخیره بک‌آپ در فایل JSON
    const backupData = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // دانلود فایل
    const a = document.createElement('a');
    a.href = url;
    a.download = `supabase_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('بک‌آپ با موفقیت تکمیل شد!');
    return backup;

  } catch (error) {
    console.error('خطا در بک‌آپ:', error);
    throw error;
  }
};

// تابع بک‌آپ فقط محصولات
export const backupProducts = async () => {
  try {
    console.log('بک‌آپ محصولات...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    const backup = {
      timestamp: new Date().toISOString(),
      products: products || []
    };

    // دانلود فایل
    const backupData = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`بک‌آپ ${products?.length || 0} محصول تکمیل شد!`);
    return backup;

  } catch (error) {
    console.error('خطا در بک‌آپ محصولات:', error);
    throw error;
  }
};

// تابع بک‌آپ فقط سفارشات و مشتریان
export const backupOrdersAndCustomers = async () => {
  try {
    console.log('بک‌آپ سفارشات و مشتریان...');
    
    // بک‌آپ سفارشات
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');

    if (ordersError) throw ordersError;

    // بک‌آپ آیتم‌های سفارش
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*');

    if (itemsError) throw itemsError;

    // بک‌آپ پروفایل‌ها
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    const backup = {
      timestamp: new Date().toISOString(),
      orders: orders || [],
      orderItems: orderItems || [],
      profiles: profiles || []
    };

    // دانلود فایل
    const backupData = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`بک‌آپ ${orders?.length || 0} سفارش و ${profiles?.length || 0} مشتری تکمیل شد!`);
    return backup;

  } catch (error) {
    console.error('خطا در بک‌آپ سفارشات:', error);
    throw error;
  }
};

// تابع بازیابی از بک‌آپ
export const restoreFromBackup = async (backupData) => {
  try {
    console.log('شروع بازیابی از بک‌آپ...');
    
    const results = {};

    // بازیابی هر جدول
    for (const [tableName, data] of Object.entries(backupData.tables)) {
      if (data.error) {
        console.error(`خطا در جدول ${tableName}:`, data.error);
        continue;
      }

      try {
        // حذف داده‌های موجود (اختیاری)
        // await supabase.from(tableName).delete().neq('id', 0);

        // درج داده‌های جدید
        const { error } = await supabase
          .from(tableName)
          .insert(data);

        if (error) {
          console.error(`خطا در بازیابی جدول ${tableName}:`, error);
          results[tableName] = { error: error.message };
        } else {
          console.log(`جدول ${tableName} با موفقیت بازیابی شد`);
          results[tableName] = { success: true, count: data.length };
        }
      } catch (err) {
        console.error(`خطا در بازیابی جدول ${tableName}:`, err);
        results[tableName] = { error: err.message };
      }
    }

    console.log('بازیابی تکمیل شد!');
    return results;

  } catch (error) {
    console.error('خطا در بازیابی:', error);
    throw error;
  }
};
