# راهنمای Deploy تغییرات - انتخاب شرکت ارسال‌کننده

## 📋 خلاصه تغییرات

این تغییرات امکان انتخاب شرکت ارسال‌کننده (پست یا تیپاکس) را در صفحه checkout اضافه می‌کند.

---

## 🗄️ مرحله 1: Migration دیتابیس (Supabase)

### فایل Migration:
- `migration_add_shipping_company.sql`

### مراحل:
1. وارد **Supabase Dashboard** شوید
2. به بخش **SQL Editor** بروید
3. محتوای فایل `migration_add_shipping_company.sql` را کپی کنید
4. در SQL Editor اجرا کنید
5. مطمئن شوید که ستون `shipping_company` به جدول `orders` اضافه شده است

---

## 🖥️ مرحله 2: Backend Server (Node.js/Express)

### فایل‌های تغییر یافته:
```
server/
├── routes/
│   ├── orders.js      ✅ تغییر یافته
│   └── sales.js       ✅ تغییر یافته
```

### مراحل Deploy:
1. **فایل‌های تغییر یافته را در سرور کپی کنید:**
   - `server/routes/orders.js`
   - `server/routes/sales.js`

2. **مسیر فایل‌ها در سرور:**
   ```
   C:\e-commerce\server\routes\
   ├── orders.js
   └── sales.js
   ```

3. **Restart سرور:**
   ```powershell
   pm2 restart lent-shop-api
   # یا
   pm2 restart server
   ```

4. **بررسی لاگ‌ها:**
   ```powershell
   pm2 logs lent-shop-api --lines 50
   ```

---

## 🌐 مرحله 3: Frontend (Build و Deploy)

### فایل‌های تغییر یافته:
```
src/
├── Components/
│   ├── Pages/
│   │   ├── Checkout.SMS.jsx    ✅ تغییر یافته
│   │   └── UserAccount.jsx     ✅ تغییر یافته
│   └── Admin/
│       └── SalesReport.jsx      ✅ تغییر یافته
```

### مراحل Deploy:

#### 1. Build کردن Frontend:
```powershell
# در مسیر پروژه
cd e:\FrontProjects\Lent-shop-new\lent-shop
npm run build
```

#### 2. فایل‌های Build شده:
بعد از build، فایل‌های زیر در پوشه `dist/` ایجاد می‌شوند:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── web.config
```

#### 3. کپی فایل‌های Build شده به هاست:
```powershell
# کپی فایل‌های dist به هاست IIS
xcopy C:\e-commerce\dist\* C:\inetpub\wwwroot\lent-shop\ /E /Y
```

**یا به صورت دستی:**
- محتوای پوشه `dist/` را کپی کنید
- در پوشه هاست (`C:\inetpub\wwwroot\lent-shop\`) جایگزین کنید

---

## ✅ چک‌لیست Deploy

### قبل از Deploy:
- [ ] Migration دیتابیس اجرا شده است
- [ ] فایل‌های backend در سرور کپی شده‌اند
- [ ] Frontend build شده است
- [ ] فایل‌های dist در هاست کپی شده‌اند

### بعد از Deploy:
- [ ] سرور Express restart شده است
- [ ] لاگ‌های سرور بررسی شده است (بدون خطا)
- [ ] صفحه checkout باز می‌شود
- [ ] گزینه‌های "پست" و "تیپاکس" نمایش داده می‌شوند
- [ ] انتخاب شرکت ارسال‌کننده ذخیره می‌شود
- [ ] در حساب کاربری نمایش داده می‌شود
- [ ] در پنل ادمین نمایش داده می‌شود

---

## 🔍 تست کردن

### 1. تست Frontend:
- وارد صفحه `/checkout` شوید
- فرم را پر کنید
- گزینه "تیپاکس (پس کرایه)" را انتخاب کنید
- سفارش را ثبت کنید

### 2. تست Backend:
```powershell
# بررسی لاگ‌های سرور
pm2 logs lent-shop-api --lines 100
```

### 3. تست دیتابیس:
در Supabase، بررسی کنید که:
- ستون `shipping_company` در جدول `orders` وجود دارد
- سفارش جدید با `shipping_company` ذخیره شده است

---

## 📝 نکات مهم

1. **ترتیب Deploy:**
   - ابتدا Migration دیتابیس
   - سپس Backend Server
   - در آخر Frontend

2. **Backup:**
   - قبل از Deploy، از فایل‌های قبلی backup بگیرید

3. **Environment Variables:**
   - مطمئن شوید که `.env` در سرور به‌روز است

4. **Cache:**
   - بعد از Deploy، cache مرورگر را پاک کنید (Ctrl+Shift+R)

---

## 🆘 در صورت بروز مشکل

### خطای دیتابیس:
- بررسی کنید که Migration اجرا شده است
- بررسی کنید که ستون `shipping_company` وجود دارد

### خطای Backend:
- بررسی لاگ‌های PM2
- بررسی کنید که فایل‌ها درست کپی شده‌اند
- بررسی کنید که سرور restart شده است

### خطای Frontend:
- بررسی کنید که build موفق بوده است
- بررسی کنید که فایل‌های dist درست کپی شده‌اند
- Cache مرورگر را پاک کنید

