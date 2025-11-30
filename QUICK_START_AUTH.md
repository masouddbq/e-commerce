# 🚀 راهنمای سریع: ورود کاربران برای خرید

## ⚡ شروع سریع (برای تست فوری)

### گام 1️⃣: استفاده از نسخه Email

```bash
# 1. فایل Checkout فعلی را backup کنید
mv src/Components/Pages/Checkout.jsx src/Components/Pages/Checkout.SMS.jsx

# 2. نسخه Email را فعال کنید
mv src/Components/Pages/Checkout.EMAIL.jsx src/Components/Pages/Checkout.jsx
```

### گام 2️⃣: تنظیمات Supabase (یکبار)

1. به [supabase.com](https://supabase.com) بروید
2. پروژه بسازید یا وارد پروژه خود شوید
3. **Authentication → Providers → Email** را فعال کنید
4. **"Confirm email"** را غیرفعال کنید (برای تست سریع‌تر)
5. SQL زیر را در **SQL Editor** اجرا کنید:

```sql
-- جداول مورد نیاز
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  total_amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders ON DELETE CASCADE,
  product_id INTEGER,
  name_snapshot TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own orders" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own order items" ON order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users insert own order items" ON order_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
```

### گام 3️⃣: تنظیم Environment Variables

ایجاد فایل `.env.local` در ریشه پروژه:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**کجا پیدا کنم؟**
- Settings → API → Project URL
- Settings → API → anon/public key

### گام 4️⃣: تست کنید!

```bash
# اجرای پروژه
npm run dev

# مراحل تست:
# 1. محصولی به سبد خرید اضافه کنید
# 2. روی "ادامه فرآیند خرید" کلیک کنید
# 3. ایمیل خود را وارد کنید (هر ایمیل معتبر)
# 4. روی "ارسال کد تایید" کلیک کنید
# 5. به ایمیل خود بروید و کد 6 رقمی را کپی کنید
# 6. کد را وارد کنید و "تایید و ادامه" بزنید
# 7. فرم را پر کنید و سفارش را ثبت کنید
```

---

## 📱 برای استفاده در Production (SMS)

وقتی آماده شدید، برای SMS:

### 1️⃣ ثبت‌نام در Twilio

```bash
1. به https://twilio.com بروید
2. حساب رایگان بسازید ($15 credit رایگان)
3. یک شماره موبایل بخرید (~$1/ماه)
4. Account SID و Auth Token را کپی کنید
```

### 2️⃣ تنظیم در Supabase

```bash
1. Authentication → Providers → Phone
2. "Enable Phone provider" را فعال کنید
3. Twilio credentials را وارد کنید:
   - Account SID
   - Auth Token  
   - Phone number (با + و کد کشور)
4. Save کنید
```

### 3️⃣ بازگشت به نسخه SMS

```bash
# بازگردانی فایل اصلی
mv src/Components/Pages/Checkout.jsx src/Components/Pages/Checkout.EMAIL.backup.jsx
mv src/Components/Pages/Checkout.SMS.jsx src/Components/Pages/Checkout.jsx
```

---

## 🐛 مشکل دارید؟

### خطای "relation does not exist"
✅ SQL بالا را اجرا کنید

### ایمیل نمی‌آید
✅ Spam را چک کنید
✅ چند دقیقه صبر کنید
✅ Supabase Authentication → Logs را چک کنید

### کد اشتباه است
✅ کد جدید بگیرید
✅ مطمئن شوید 6 رقم را کامل وارد می‌کنید

### خطای API key
✅ `.env.local` را چک کنید
✅ سرور را restart کنید

---

## 📚 اسناد کامل

برای توضیحات کامل‌تر:
- [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) - راهنمای کامل احراز هویت
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - راهنمای پنل ادمین

---

## ✨ خلاصه سریع

| روش | مزایا | معایب | برای |
|-----|-------|-------|------|
| **Email OTP** | رایگان، سریع، آسان | کمتر حرفه‌ای | تست و توسعه |
| **SMS OTP** | حرفه‌ای، راحت‌تر برای کاربر | نیاز به Twilio ($) | Production |

**توصیه:** شروع با Email، بعد انتقال به SMS ✅

