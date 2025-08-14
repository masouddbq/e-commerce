# راهنمای تنظیم Storage در Supabase

## 🚀 **مراحل تنظیم Storage:**

### **1. ایجاد Storage Bucket:**
در Supabase Dashboard:
- به بخش **Storage** بروید
- روی **New Bucket** کلیک کنید
- نام bucket: `product-images`
- گزینه **Public bucket** را فعال کنید
- روی **Create bucket** کلیک کنید

### **2. تنظیم Storage Policies:**
در SQL Editor این دستورات را اجرا کنید:

```sql
-- ایجاد policy برای خواندن عکس‌ها (همه کاربران)
CREATE POLICY "Allow public read access to product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- ایجاد policy برای آپلود عکس‌ها (فقط ادمین)
CREATE POLICY "Allow admin upload to product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

-- ایجاد policy برای حذف عکس‌ها (فقط ادمین)
CREATE POLICY "Allow admin delete from product images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images');
```

### **3. بررسی تنظیمات:**
- در بخش Storage > Policies بررسی کنید که policies ایجاد شده باشند
- در بخش Storage > Buckets بررسی کنید که bucket `product-images` وجود داشته باشد

## 📝 **نکات مهم:**

1. **حجم فایل:** حداکثر 5MB برای هر عکس
2. **فرمت‌های پشتیبانی شده:** PNG, JPG, JPEG, GIF, WebP
3. **نام فایل:** به صورت خودکار با ID محصول و timestamp ایجاد می‌شود
4. **امنیت:** عکس‌ها عمومی هستند و همه کاربران می‌توانند ببینند
5. **WebP:** فرمت مدرن با فشرده‌سازی بهتر (پیشنهاد می‌شود)

## 🔧 **عیب‌یابی:**

اگر با خطا مواجه شدید:
1. بررسی کنید که bucket `product-images` ایجاد شده باشد
2. بررسی کنید که policies درست تنظیم شده باشند
3. بررسی کنید که RLS در جدول `products` فعال باشد
4. در کنسول مرورگر خطاها را بررسی کنید

## 📱 **استفاده در اپلیکیشن:**

بعد از تنظیم Storage:
- ادمین می‌تواند عکس محصولات را آپلود کند
- عکس‌ها در فرم محصول نمایش داده می‌شوند
- عکس‌ها در صفحه محصول نمایش داده می‌شوند
- حذف محصول، عکس آن را نیز از Storage حذف می‌کند
