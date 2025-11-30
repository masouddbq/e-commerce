# 🔐 راهنمای احراز هویت و ورود کاربران - لنت شاپ

## 📋 فهرست مطالب
1. [روش‌های احراز هویت](#روش-های-احراز-هویت)
2. [تنظیمات اولیه Supabase](#تنظیمات-اولیه-supabase)
3. [ورود با شماره موبایل (SMS OTP)](#ورود-با-شماره-موبایل-sms-otp)
4. [ورود با ایمیل (برای تست)](#ورود-با-ایمیل-برای-تست)
5. [نحوه تست سیستم](#نحوه-تست-سیستم)
6. [مشکلات رایج و راه‌حل](#مشکلات-رایج-و-راه-حل)

---

## 🎯 روش‌های احراز هویت

### در لنت شاپ دو نوع ورود داریم:

#### 1️⃣ **ورود کاربران عادی (برای خرید)**
- از طریق **شماره موبایل** با **کد OTP**
- بدون نیاز به رمز عبور
- در صفحه **Checkout** (تکمیل سفارش)

#### 2️⃣ **ورود ادمین (مدیریت فروشگاه)**
- از طریق **ایمیل و رمز عبور**
- فقط برای مدیران
- در صفحه **/login**

---

## ⚙️ تنظیمات اولیه Supabase

### 1️⃣ **ایجاد پروژه Supabase**

```bash
1. به https://supabase.com بروید
2. حساب کاربری بسازید
3. پروژه جدید ایجاد کنید: "lent-shop"
4. منطقه را انتخاب کنید (پیشنهاد: "West US" برای سرعت بیشتر)
```

### 2️⃣ **دریافت API Keys**

```bash
1. در Dashboard پروژه، به Settings → API بروید
2. دو کلید را کپی کنید:
   - Project URL
   - anon/public key
```

### 3️⃣ **تنظیم فایل .env.local**

در ریشه پروژه، فایل `.env.local` بسازید:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **نکته مهم:** این فایل را در `.gitignore` قرار دهید تا در Git commit نشود!

### 4️⃣ **ایجاد جداول دیتابیس**

در **SQL Editor** سوپابیس، کوئری زیر را اجرا کنید:

```sql
-- جدول profiles (پروفایل کاربران)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- فعال‌سازی RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: کاربران فقط پروفایل خودشون رو ببینن
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: کاربران فقط پروفایل خودشون رو ویرایش کنن
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: کاربران پروفایل خودشون رو بسازن
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- جدول orders (سفارشات)
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

-- فعال‌سازی RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: کاربران فقط سفارشات خودشون رو ببینن
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: کاربران سفارش جدید ثبت کنن
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- جدول order_items (اقلام سفارش)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders ON DELETE CASCADE,
  product_id INTEGER,
  name_snapshot TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- فعال‌سازی RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: کاربران فقط اقلام سفارشات خودشون رو ببینن
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Policy: کاربران اقلام سفارش جدید ثبت کنن
CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );
```

---

## 📱 ورود با شماره موبایل (SMS OTP)

### ⚠️ این روش نیاز به تنظیمات بک‌اند دارد

از نسخه فعلی پروژه، ارسال OTP از طریق یک **سرور Node.js داخلی** انجام می‌شود که به Supabase متصل است و پیامک را با **پنل فراز اس‌ام‌اس** می‌فرستد. بنابراین نیازی به فعال‌سازی سرویس‌های خارجی (Twilio و …) در Supabase ندارید.

### 🔧 مراحل راه‌اندازی OTP با فراز اس‌ام‌اس

1. **جدول ذخیره لاگ OTP را بسازید**
   - در SQL Editor سوپابیس، بخش انتهایی فایل `database_setup.sql` (بخش `otp_requests`) را اجرا کنید.

2. **فایل‌های env را تنظیم کنید**
   - در ریشه پروژه یک فایل `.env` بسازید و مقادیر زیر را قرار دهید:
     ```env
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=service-role-key-here
     CLIENT_ORIGIN=http://localhost:5173
     PORT=4000
     FARAZ_SMS_API_URL=https://ippanel.com/api/select
     FARAZ_SMS_USERNAME=your_faraz_user
     FARAZ_SMS_PASSWORD=your_faraz_pass
     FARAZ_SMS_SENDER_NUMBER=3000xxxxxxx
     FARAZ_SMS_PATTERN_CODE=optional-pattern-code
     OTP_SMS_TEMPLATE=کد تایید شما: {code}
     OTP_EXPIRATION_MINUTES=2
     OTP_MAX_PER_HOUR=5
     ```
   - در فایل `.env.local` (سمت فرانت) علاوه بر مقادیر قبلی، `VITE_API_BASE_URL=http://localhost:4000` را اضافه کنید.

3. **سرور OTP را اجرا کنید**
   ```bash
   npm run server
   ```
   سرور با مسیر `/api/otp/send` و `/api/otp/verify` فعال می‌شود و به فرانت برای ارسال و تایید کد متصل است.

4. **Channel پیامکی (Pattern)**
   - اگر در فراز از قالب آماده استفاده می‌کنید، مقدار `FARAZ_SMS_PATTERN_CODE` را تنظیم کنید و در متغیر `OTP_SMS_TEMPLATE` از `{code}` استفاده کنید.
   - در غیر این صورت، سرور از متن خام `OTP_SMS_TEMPLATE` برای ارسال استفاده می‌کند.

> **نکته:** برای کار با Supabase، هر شماره موبایل به صورت خودکار یک «ایمیل مجازی» از قالب `شماره@دامنه-otp` (مقدار `OTP_EMAIL_DOMAIN`) دریافت می‌کند. این ایمیل فقط جهت ایجاد حساب Supabase است و برای کاربر نمایش داده نمی‌شود.

> **نکته:** سرور برای تولید OTP از API ادمین Supabase استفاده می‌کند. بنابراین همچنان `supabase.auth.verifyOtp` در فرانت اجرا می‌شود و session کاربر در Supabase برقرار می‌گردد.

---

## 📧 ورود با ایمیل (برای تست)

### ✅ این روش رایگان است و برای تست مناسب!

اگر می‌خواهید **بدون تنظیم SMS** سیستم را تست کنید، می‌توانید از **Email OTP** استفاده کنید.

### 🔧 فعال‌سازی Email OTP در Supabase

```bash
1. در Dashboard Supabase → Authentication → Providers
2. Email را پیدا کنید
3. "Enable Email provider" را فعال کنید
4. "Confirm email" را غیرفعال کنید (برای تست سریع‌تر)
5. Save کنید
```

### 📝 تغییر کد برای استفاده از Email به جای شماره

در فایل `src/Components/Pages/Checkout.jsx`، می‌توانید موقتاً از ایمیل استفاده کنید:

```jsx
// خط 67 - تغییر از phone به email
const handleSendOtp = async () => {
  setAuthError('');
  try {
    const { error } = await supabase.auth.signInWithOtp({ 
      email: phone  // استفاده از phone field برای email
    });
    if (error) throw error;
    setOtpSent(true);
  } catch (err) {
    setAuthError(err?.message || 'خطا در ارسال کد.');
  }
};

// خط 75 - تغییر verification
const handleVerifyOtp = async () => {
  setAuthError('');
  try {
    const { data, error } = await supabase.auth.verifyOtp({ 
      email: phone,  // استفاده از phone field برای email
      token: otpCode, 
      type: 'email'  // تغییر از 'sms' به 'email'
    });
    // ... بقیه کد
```

**نکته:** Label ورودی را هم تغییر دهید:

```jsx
// خط 174
<label className="block text-sm mb-1">ایمیل</label>  // به جای "شماره موبایل"
<input 
  value={phone} 
  onChange={(e) => setPhone(e.target.value)} 
  placeholder="user@example.com"  // به جای "09123456789"
  dir="ltr" 
  type="email"  // اضافه کردن type
  className="w-full border rounded-lg px-3 py-2" 
/>
```

---

## 🧪 نحوه تست سیستم

### **روش 1: تست با Email (پیشنهادی برای شروع)**

```bash
1. تغییرات بالا را در Checkout.jsx اعمال کنید
2. پروژه را اجرا کنید: npm run dev
3. یک محصول به سبد خرید اضافه کنید
4. روی "ادامه فرآیند خرید" کلیک کنید
5. ایمیل خود را وارد کنید (مثلاً: test@gmail.com)
6. روی "ارسال کد تایید" کلیک کنید
7. به ایمیل خود بروید و کد 6 رقمی را کپی کنید
8. کد را وارد کنید و "تایید و ادامه" بزنید
9. فرم اطلاعات را پر کنید
10. روی "پرداخت و ثبت نهایی سفارش" کلیک کنید
```

### **روش 2: تست با شماره موبایل (نیاز به SMS Provider)**

```bash
1. SMS Provider را در Supabase تنظیم کنید (Twilio توصیه می‌شود)
2. کد را به حالت اصلی برگردانید (اگر تغییر داده‌اید)
3. پروژه را اجرا کنید: npm run dev
4. یک محصول به سبد خرید اضافه کنید
5. روی "ادامه فرآیند خرید" کلیک کنید
6. شماره موبایل خود را وارد کنید (فرمت: 09123456789)
7. روی "ارسال کد تایید" کلیک کنید
8. پیامک را دریافت کنید و کد 6 رقمی را وارد کنید
9. "تایید و ادامه" بزنید
10. فرم اطلاعات را پر کنید
11. سفارش را ثبت کنید
```

### **بررسی سفارش در Database:**

```bash
1. به Supabase Dashboard بروید
2. Table Editor → orders
3. سفارش جدید را ببینید
4. Table Editor → order_items
5. اقلام سفارش را ببینید
```

---

## 🐛 مشکلات رایج و راه‌حل

### 1️⃣ **خطای "خطا در ارسال کد"**

**علت:** SMS Provider تنظیم نشده یا اشتباه است.

**راه‌حل:**
```bash
- از Email OTP استفاده کنید (تست)
- یا SMS Provider را دوباره تنظیم کنید
- Logs را در Supabase چک کنید: Authentication → Logs
```

### 2️⃣ **کد OTP اشتباه است**

**علت:** کد منقضی شده یا اشتباه وارد شده.

**راه‌حل:**
```bash
- کد جدید بگیرید
- مطمئن شوید کد را کامل وارد می‌کنید (6 رقم)
- از copy/paste استفاده کنید
```

### 3️⃣ **خطای "relation does not exist"**

**علت:** جداول دیتابیس ایجاد نشده.

**راه‌حل:**
```bash
- SQL script بالا را در SQL Editor اجرا کنید
- مطمئن شوید در پروژه درست هستید
```

### 4️⃣ **خطای "Invalid API key"**

**علت:** Environment variables اشتباه است.

**راه‌حل:**
```bash
- فایل .env.local را چک کنید
- API keys را از Supabase Dashboard دوباره کپی کنید
- سرور را restart کنید: npm run dev
```

### 5️⃣ **ایمیل OTP دریافت نمی‌شود**

**راه‌حل:**
```bash
- پوشه Spam را چک کنید
- چند دقیقه صبر کنید
- ایمیل دیگری امتحان کنید
- Supabase Logs را چک کنید
```

### 6️⃣ **SMS دریافت نمی‌شود**

**راه‌حل:**
```bash
- Twilio account balance را چک کنید
- شماره موبایل را با فرمت درست وارد کنید
- Twilio Logs را چک کنید
- شماره در blacklist نباشد
```

---

## 🎯 توصیه‌های نهایی

### **برای محیط توسعه (Development):**
✅ از **Email OTP** استفاده کنید - رایگان و سریع

### **برای محیط تولید (Production):**
✅ از **SMS OTP** استفاده کنید - حرفه‌ای‌تر و بهتر

### **برای امنیت بیشتر:**
```bash
1. Rate limiting فعال کنید
2. CAPTCHA اضافه کنید (برای جلوگیری از spam)
3. IP whitelist/blacklist تنظیم کنید
4. Session timeout مناسب تنظیم کنید
```

---

## 📞 پشتیبانی

### **لینک‌های مفید:**

- [مستندات Supabase Auth](https://supabase.com/docs/guides/auth)
- [مستندات Phone Auth](https://supabase.com/docs/guides/auth/phone-login)
- [راهنمای Twilio](https://www.twilio.com/docs)
- [Community Supabase](https://github.com/supabase/supabase/discussions)

### **Console Commands برای Debug:**

```javascript
// در Browser Console:

// چک کردن session
console.log(await supabase.auth.getSession())

// چک کردن user
console.log(await supabase.auth.getUser())

// Sign out
await supabase.auth.signOut()
```

---

## 🎉 تمام! سیستم ورود شما آماده است!

**توجه:** حتماً یکی از روش‌های بالا را تست کنید تا مطمئن شوید همه چیز درست کار می‌کند.

