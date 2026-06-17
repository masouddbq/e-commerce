# راهنمای Deploy سیستم کامنت/نظر محصولات

## 📋 خلاصه تغییرات

این تغییرات سیستم کامنت/نظر برای محصولات را اضافه می‌کند که کاربران لاگین شده می‌توانند نظرات خود را ثبت، ویرایش و حذف کنند.

---

## 🗄️ مرحله 1: Migration دیتابیس (Supabase)

### فایل Migration:
- `migration_create_comments_table.sql`

### مراحل:
1. وارد **Supabase Dashboard** شوید
2. به بخش **SQL Editor** بروید
3. محتوای فایل `migration_create_comments_table.sql` را کپی کنید
4. در SQL Editor اجرا کنید
5. مطمئن شوید که جدول `comments` ایجاد شده است

---

## 🖥️ مرحله 2: Backend Server (Node.js/Express)

### فایل‌های جدید/تغییر یافته:
```
server/
├── routes/
│   └── comments.js      ✅ فایل جدید
└── index.js             ✅ تغییر یافته (اضافه شدن comments router)
```

### مراحل Deploy:
1. **فایل جدید را در سرور کپی کنید:**
   - `server/routes/comments.js` (فایل جدید)

2. **فایل تغییر یافته را در سرور جایگزین کنید:**
   - `server/index.js`

3. **مسیر فایل‌ها در سرور:**
   ```
   C:\e-commerce\server\
   ├── routes\
   │   └── comments.js
   └── index.js
   ```

4. **Restart سرور:**
   ```powershell
   pm2 restart lent-shop-api
   # یا
   pm2 restart server
   ```

5. **بررسی لاگ‌ها:**
   ```powershell
   pm2 logs lent-shop-api --lines 50
   ```

---

## 🌐 مرحله 3: Frontend (Build و Deploy)

### فایل‌های تغییر یافته:
```
src/
└── Components/
    ├── Common/
    │   └── ReviewSection.jsx    ✅ تغییر یافته
    └── ProductDetail/
        └── ProductDetail.jsx     ✅ تغییر یافته
```

### مراحل Deploy:

#### 1. Build کردن Frontend:
```powershell
# در مسیر پروژه
cd e:\FrontProjects\Lent-shop-new\lent-shop
npm run build
```

#### 2. کپی فایل‌های Build شده به هاست:
```powershell
# کپی فایل‌های dist به هاست IIS
xcopy C:\e-commerce\dist\* C:\inetpub\wwwroot\lent-shop\ /E /Y
```

---

## ✅ چک‌لیست Deploy

### قبل از Deploy:
- [ ] Migration دیتابیس اجرا شده است
- [ ] فایل `comments.js` در سرور کپی شده است
- [ ] فایل `index.js` در سرور به‌روزرسانی شده است
- [ ] Frontend build شده است
- [ ] فایل‌های dist در هاست کپی شده‌اند

### بعد از Deploy:
- [ ] سرور Express restart شده است
- [ ] لاگ‌های سرور بررسی شده است (بدون خطا)
- [ ] صفحه محصول باز می‌شود
- [ ] بخش نظرات نمایش داده می‌شود
- [ ] کاربر لاگین شده می‌تواند نظر ثبت کند
- [ ] کاربر می‌تواند نظر خود را ویرایش/حذف کند
- [ ] کاربر غیرلاگین شده پیام "ورود/ثبت نام" می‌بیند

---

## 🔍 تست کردن

### 1. تست Frontend:
- وارد صفحه یک محصول شوید
- اگر لاگین نیستید، باید پیام "برای ثبت نظر باید وارد حساب کاربری شوید" را ببینید
- وارد حساب کاربری شوید
- یک نظر با امتیاز و متن ثبت کنید
- بررسی کنید که نظر نمایش داده می‌شود
- سعی کنید نظر خود را ویرایش کنید
- سعی کنید نظر خود را حذف کنید

### 2. تست Backend:
```powershell
# بررسی لاگ‌های سرور
pm2 logs lent-shop-api --lines 100
```

### 3. تست دیتابیس:
در Supabase، بررسی کنید که:
- جدول `comments` وجود دارد
- نظر جدید در جدول ذخیره شده است
- ستون‌های `product_id`, `user_id`, `rating`, `comment` پر شده‌اند

---

## 📝 نکات مهم

1. **ترتیب Deploy:**
   - ابتدا Migration دیتابیس
   - سپس Backend Server
   - در آخر Frontend

2. **احراز هویت:**
   - فقط کاربران لاگین شده می‌توانند نظر ثبت کنند
   - کاربران فقط می‌توانند نظرات خود را ویرایش/حذف کنند

3. **امنیت:**
   - RLS (Row Level Security) در دیتابیس فعال است
   - API endpoints از middleware `authenticateUser` استفاده می‌کنند

---

## 🆘 در صورت بروز مشکل

### خطای دیتابیس:
- بررسی کنید که Migration اجرا شده است
- بررسی کنید که جدول `comments` وجود دارد
- بررسی کنید که RLS policies درست تنظیم شده‌اند

### خطای Backend:
- بررسی لاگ‌های PM2
- بررسی کنید که فایل `comments.js` درست کپی شده است
- بررسی کنید که route در `index.js` اضافه شده است
- بررسی کنید که سرور restart شده است

### خطای Frontend:
- بررسی کنید که build موفق بوده است
- بررسی کنید که فایل‌های dist درست کپی شده‌اند
- بررسی کنید که `VITE_API_BASE_URL` در `.env` تنظیم شده است
- Cache مرورگر را پاک کنید
