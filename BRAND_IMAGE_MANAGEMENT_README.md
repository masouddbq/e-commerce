# راهنمای مدیریت عکس برندها

## خلاصه
این قابلیت جدید امکان آپلود، ویرایش و حذف عکس برندها را در ادمین پنل فراهم می‌کند. عکس‌های آپلود شده در کاروسل لوگوهای برند در صفحه اصلی نمایش داده می‌شوند.

## ویژگی‌های جدید

### 1. آپلود عکس برند
- پشتیبانی از فرمت‌های JPG, PNG, GIF, WebP
- حداکثر حجم فایل: 5 مگابایت
- آپلود خودکار به Supabase Storage

### 2. ویرایش عکس برند
- امکان تغییر عکس موجود
- حذف خودکار عکس قدیمی
- پیش‌نمایش عکس جدید

### 3. حذف عکس برند
- حذف خودکار عکس از Storage هنگام حذف برند
- مدیریت خطاها

## مراحل راه‌اندازی

### مرحله 1: بروزرسانی دیتابیس
فایل `fix_badges_column.sql` را در SQL Editor اجرا کنید:

```sql
-- اضافه کردن ستون image به جدول brands
ALTER TABLE IF EXISTS brands 
ADD COLUMN IF NOT EXISTS image TEXT;

-- ایجاد Storage Bucket برای عکس‌های برندها
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-images', 'brand-images', true) 
ON CONFLICT (id) DO NOTHING;

-- ایجاد policy های لازم
CREATE POLICY IF NOT EXISTS "Allow public read access to brand images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'brand-images');

CREATE POLICY IF NOT EXISTS "Allow admin upload to brand images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'brand-images');

CREATE POLICY IF NOT EXISTS "Allow admin delete from brand images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'brand-images');
```

### مرحله 2: بروزرسانی کد
کدهای زیر بروزرسانی شده‌اند:

1. **`src/lib/supabase.js`** - توابع آپلود و حذف عکس برند
2. **`src/Components/Admin/AdminPanel.jsx`** - UI مدیریت عکس برند
3. **`src/Components/HomePage/BrandCategories.jsx`** - نمایش عکس‌های دیتابیس

### مرحله 3: تست قابلیت
1. وارد ادمین پنل شوید
2. به تب "مدیریت برندها، برندهای لنت و دسته‌بندی‌ها" بروید
3. در بخش "برندها" عکس جدید آپلود کنید
4. عکس را در صفحه اصلی بررسی کنید

## ساختار فایل‌ها

### Storage Buckets
- `product-images`: عکس‌های محصولات
- `brand-images`: عکس‌های برندها (جدید)

### جداول دیتابیس
```sql
brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT  -- ستون جدید
)
```

## توابع جدید

### `uploadBrandImage(file, brandId)`
آپلود عکس برند به Storage

### `deleteBrandImage(imageUrl)`
حذف عکس برند از Storage

### `handleBrandImageUpload(event)`
مدیریت انتخاب فایل عکس

### `clearBrandImageSelection()`
پاک کردن انتخاب عکس

## نکات مهم

1. **فرمت‌های پشتیبانی شده**: JPG, PNG, GIF, WebP
2. **حجم حداکثر**: 5 مگابایت
3. **نام فایل**: `brand-{brandId}-{timestamp}.{extension}`
4. **Fallback**: در صورت عدم وجود عکس، از عکس‌های پیش‌فرض استفاده می‌شود

## عکس‌های پیش‌فرض
در صورت عدم آپلود عکس، سیستم از عکس‌های پیش‌فرض زیر استفاده می‌کند:

- سایپا: `/saipa.png`
- ایران خودرو: `/irankhodro.png`
- پژو: `/peugeot.png`
- هیوندای: `/hyun.png`
- نیسان: `/nissan.png`
- تویوتا: `/toyota.png`
- لکسوس: `/lexus.png`
- کیا: `/kia.png`
- و سایر برندها...

## عیب‌یابی

### مشکل: عکس آپلود نمی‌شود
1. بررسی اتصال به Supabase
2. بررسی وجود bucket `brand-images`
3. بررسی policy های Storage

### مشکل: عکس نمایش داده نمی‌شود
1. بررسی URL عکس در دیتابیس
2. بررسی دسترسی عمومی به bucket
3. بررسی وجود فایل در Storage

### مشکل: خطای آپلود
1. بررسی نوع فایل
2. بررسی حجم فایل
3. بررسی فضای Storage

## بروزرسانی‌های آینده

- پشتیبانی از چند عکس برای هر برند
- امکان crop و resize عکس
- بهینه‌سازی خودکار عکس‌ها
- پشتیبانی از WebP
- CDN برای عکس‌ها
