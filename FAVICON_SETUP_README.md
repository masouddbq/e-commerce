# راهنمای تنظیم Favicon برای لنت شاپ

## خلاصه
این راهنما نحوه تنظیم favicon سفارشی برای سایت لنت شاپ را توضیح می‌دهد.

## فایل‌های ایجاد شده

### 1. favicon.svg (اصلی)
- **مسیر**: `/public/favicon.svg`
- **مشخصات**: زمینه آبی (#2563eb) با حرف L سفید
- **فرمت**: SVG (مقیاس‌پذیر)
- **اندازه**: 32x32 pixels

### 2. favicon.ico
- **مسیر**: `/public/favicon.ico`
- **نکته**: این فایل باید با ابزارهای مخصوص ایجاد شود

### 3. favicon-16x16.png
- **مسیر**: `/public/favicon-16x16.png`
- **اندازه**: 16x16 pixels
- **نکته**: برای نمایش در تب‌های کوچک

### 4. favicon-32x32.png
- **مسیر**: `/public/favicon-32x32.png`
- **اندازه**: 32x32 pixels
- **نکته**: برای نمایش در تب‌های بزرگ

## نحوه ایجاد فایل‌های PNG

### روش 1: استفاده از ابزارهای آنلاین
1. فایل `favicon.svg` را در [favicon.io](https://favicon.io/) آپلود کنید
2. فایل‌های مختلف را دانلود کنید
3. فایل‌های PNG را در پوشه `public` قرار دهید

### روش 2: استفاده از GIMP یا Photoshop
1. فایل `favicon.svg` را باز کنید
2. در اندازه‌های مختلف export کنید
3. فرمت PNG انتخاب کنید

### روش 3: استفاده از Inkscape
1. فایل `favicon.svg` را در Inkscape باز کنید
2. File > Export PNG Image
3. اندازه‌های مختلف را تنظیم کنید

## تنظیمات index.html

فایل `index.html` بروزرسانی شده و شامل موارد زیر است:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />

<!-- Title -->
<title>لنت شاپ | فروشگاه تخصصی لنت خودرو</title>
```

## رنگ‌های استفاده شده

- **زمینه**: آبی (#2563eb) - Tailwind CSS Blue-600
- **حرف L**: سفید (#ffffff)
- **شکل**: دایره با حرف L در وسط

## تست favicon

### 1. مرورگر
- صفحه را refresh کنید
- favicon باید در تب مرورگر نمایش داده شود

### 2. Bookmark
- صفحه را bookmark کنید
- favicon باید در bookmark نمایش داده شود

### 3. موبایل
- در موبایل باز کنید
- favicon باید در tab manager نمایش داده شود

## نکات مهم

1. **فایل SVG**: بهترین کیفیت و مقیاس‌پذیر
2. **فایل ICO**: پشتیبانی از مرورگرهای قدیمی
3. **فایل‌های PNG**: پشتیبانی از اندازه‌های مختلف
4. **Apple Touch Icon**: برای iOS devices

## عیب‌یابی

### مشکل: favicon نمایش داده نمی‌شود
1. فایل‌ها در پوشه `public` قرار دارند؟
2. مسیرها در `index.html` درست هستند؟
3. مرورگر cache را پاک کرده‌اید؟

### مشکل: favicon در موبایل نمایش داده نمی‌شود
1. `apple-touch-icon` تنظیم شده؟
2. فایل‌ها در اندازه‌های مختلف موجود هستند؟

## بروزرسانی‌های آینده

- اضافه کردن favicon برای اندازه‌های مختلف
- پشتیبانی از dark mode
- اضافه کردن animated favicon
- پشتیبانی از PWA icons
