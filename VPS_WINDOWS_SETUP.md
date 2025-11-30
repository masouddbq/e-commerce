# راهنمای نصب و راه‌اندازی روی VPS ویندوز

این راهنما برای نصب و راه‌اندازی کامل پروژه روی VPS ویندوز با 2GB RAM و 1 CPU است.

## 📋 پیش‌نیازها

### 1. نصب Node.js
1. به [nodejs.org](https://nodejs.org) برو
2. نسخه LTS (حداقل v18) رو دانلود کن
3. نصب کن (گزینه "Add to PATH" رو فعال کن)
4. در PowerShell یا CMD چک کن:
   ```powershell
   node --version
   npm --version
   ```

### 2. نصب Git (اختیاری - اگر از Git استفاده می‌کنی)
1. از [git-scm.com](https://git-scm.com) دانلود کن
2. نصب کن

### 3. نصب IIS (برای سرو کردن فرانت)
1. Control Panel → Programs → Turn Windows features on or off
2. Internet Information Services (IIS) رو فعال کن
3. World Wide Web Services → Application Development Features → Node.js رو فعال کن

---

## 🚀 مراحل نصب

### مرحله 1: آپلود پروژه به VPS

#### روش 1: استفاده از Git
```powershell
cd C:\inetpub\wwwroot
git clone [آدرس ریپازیتوری شما] lent-shop
cd lent-shop
```

#### روش 2: آپلود دستی
1. کل پوشه پروژه رو با FTP یا RDP به VPS آپلود کن
2. در مسیری مثل `C:\inetpub\wwwroot\lent-shop` قرار بده

---

### مرحله 2: نصب Dependencies

```powershell
cd C:\inetpub\wwwroot\lent-shop
npm install
```

---

### مرحله 3: تنظیم فایل‌های Environment

#### 3.1 فایل `.env` در ریشه پروژه (برای فرانت)

در مسیر `C:\inetpub\wwwroot\lent-shop\.env` فایل بساز و این محتوا رو قرار بده:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Backend URL (آدرس VPS شما)
VITE_API_BASE_URL=http://your-vps-ip:4000
# یا اگر دامنه داری:
# VITE_API_BASE_URL=https://api.yourdomain.com

# Payment Gateway Configuration
VITE_ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
VITE_ZARINPAL_API_KEY=your_zarinpal_api_key
VITE_ZARINPAL_CALLBACK_URL=https://yourdomain.com/payment/callback
VITE_ZARINPAL_SANDBOX=false

# App Configuration
VITE_SITE_URL=https://yourdomain.com
VITE_SITE_NAME=لنت شاپ

# OTP Configuration
VITE_ENABLE_OTP=true
```

#### 3.2 فایل `.env` در پوشه `server` (برای بک‌اند)

در مسیر `C:\inetpub\wwwroot\lent-shop\server\.env` فایل بساز و این محتوا رو قرار بده:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# CORS Configuration (آدرس فرانت شما)
CLIENT_ORIGIN=https://yourdomain.com
# یا اگر چند دامنه داری:
# CLIENT_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Server Configuration
PORT=4000
NODE_ENV=production

# Zarinpal Payment Gateway
ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
ZARINPAL_SANDBOX=false

# Faraz SMS Configuration
FARAZ_SMS_API_URL=https://ippanel.com/api/select
FARAZ_SMS_USERNAME=your_faraz_username
FARAZ_SMS_PASSWORD=your_faraz_password
FARAZ_SMS_SENDER_NUMBER=3000xxxxxxx
OTP_SMS_TEMPLATE=کد تایید شما: {code}
OTP_EXPIRATION_MINUTES=2
OTP_MAX_PER_HOUR=5
OTP_TABLE_NAME=otp_requests
OTP_EMAIL_DOMAIN=otp.lentshop.local
```

**⚠️ مهم:** 
- `CLIENT_ORIGIN` باید دقیقاً آدرس فرانت شما باشه (با https یا http)
- `VITE_API_BASE_URL` باید آدرس بک‌اند شما باشه

---

### مرحله 4: Build کردن فرانت

```powershell
cd C:\inetpub\wwwroot\lent-shop
npm run build
```

این دستور فایل‌های production رو در پوشه `dist` می‌سازه.

---

### مرحله 5: تنظیم IIS برای فرانت

#### 5.1 ایجاد Website در IIS

1. IIS Manager رو باز کن
2. Sites → Add Website
3. تنظیمات:
   - **Site name:** lent-shop
   - **Physical path:** `C:\inetpub\wwwroot\lent-shop\dist`
   - **Binding:** 
     - Type: http یا https
     - IP address: All Unassigned
     - Port: 80 (یا 443 برای HTTPS)
     - Host name: yourdomain.com (اگر داری)

#### 5.2 تنظیم URL Rewrite (برای React Router)

1. [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite) رو نصب کن
2. در IIS Manager، روی سایت `lent-shop` کلیک کن
3. URL Rewrite → Add Rule → Blank Rule
4. تنظیمات:
   - **Name:** React Router
   - **Pattern:** `.*`
   - **Conditions:** 
     - Condition input: `{REQUEST_FILENAME}`
     - Check if input is: Not a file
     - Check if input is: Not a directory
   - **Action type:** Rewrite
   - **Rewrite URL:** `/index.html`

یا می‌تونی فایل `web.config` رو در پوشه `dist` بسازی:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Router" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

### مرحله 6: راه‌اندازی بک‌اند با PM2

#### 6.1 نصب PM2

```powershell
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install
```

#### 6.2 اجرای بک‌اند

```powershell
cd C:\inetpub\wwwroot\lent-shop
pm2 start server/index.js --name "lent-shop-api"
pm2 save
```

#### 6.3 دستورات مفید PM2

```powershell
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs lent-shop-api

# ریستارت
pm2 restart lent-shop-api

# توقف
pm2 stop lent-shop-api

# حذف
pm2 delete lent-shop-api
```

---

### مرحله 7: باز کردن پورت‌ها در Firewall

1. Windows Defender Firewall → Advanced Settings
2. Inbound Rules → New Rule
3. Port → TCP → Specific local ports: `4000`
4. Allow the connection
5. Name: "Lent Shop API"

یا با PowerShell:

```powershell
New-NetFirewallRule -DisplayName "Lent Shop API" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

---

### مرحله 8: تنظیم SSL (HTTPS) - اختیاری اما توصیه می‌شه

#### روش 1: استفاده از Let's Encrypt با win-acme

1. [win-acme](https://www.win-acme.com/) رو دانلود کن
2. اجرا کن و گزینه‌ها رو دنبال کن

#### روش 2: استفاده از Cloudflare (رایگان)

1. دامنه رو به Cloudflare اضافه کن
2. SSL/TLS → Overview → Full (strict)
3. DNS → A Record برای دامنه و api.yourdomain.com

---

## 🔧 تنظیمات اضافی

### تنظیم Reverse Proxy در IIS (اختیاری)

اگر می‌خوای بک‌اند رو از طریق IIS سرو کنی (مثلاً `https://yourdomain.com/api`):

1. [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing) رو نصب کن
2. در IIS Manager:
   - Server → Application Request Routing Cache → Server Proxy Settings → Enable proxy
   - روی سایت `lent-shop` → URL Rewrite → Add Rule → Reverse Proxy
   - Inbound: `^api/(.*)`
   - Rewrite URL: `http://localhost:4000/api/{R:1}`

---

## ✅ تست کردن

### 1. تست فرانت
- به `http://your-vps-ip` یا `https://yourdomain.com` برو
- باید صفحه اصلی سایت رو ببینی

### 2. تست بک‌اند
```powershell
# در PowerShell
Invoke-WebRequest -Uri "http://localhost:4000/health"
```

یا در مرورگر:
- `http://your-vps-ip:4000/health`

باید این پاسخ رو ببینی:
```json
{"status":"ok","uptime":123.456}
```

### 3. تست اتصال فرانت به بک‌اند
- در مرورگر، Developer Tools (F12) → Console
- باید خطای CORS نبینی
- سعی کن لاگین کنی و OTP بفرستی

---

## 🐛 عیب‌یابی

### مشکل: فرانت کار نمی‌کنه
- چک کن که فایل‌های `dist` درست build شدن
- چک کن که IIS درست تنظیم شده
- چک کن که پورت 80 بازه

### مشکل: بک‌اند کار نمی‌کنه
```powershell
# چک کردن لاگ‌ها
pm2 logs lent-shop-api

# چک کردن که پورت 4000 بازه
netstat -ano | findstr :4000
```

### مشکل: CORS Error
- چک کن که `CLIENT_ORIGIN` در `server/.env` درست تنظیم شده
- باید دقیقاً آدرس فرانت باشه (با https/http)

### مشکل: OTP ارسال نمی‌شه
- چک کن که اطلاعات Faraz SMS درسته
- چک کن که Supabase Service Role Key درسته
- لاگ‌های PM2 رو چک کن

---

## 📝 نکات مهم

1. **امنیت:**
   - فایل‌های `.env` رو در `.gitignore` قرار بده
   - از HTTPS استفاده کن
   - Firewall رو فعال نگه دار

2. **بهینه‌سازی:**
   - با 2GB RAM، بهتره فقط بک‌اند و فرانت رو اجرا کنی
   - از PM2 برای مدیریت process استفاده کن

3. **بک‌آپ:**
   - فایل‌های `.env` رو بک‌آپ بگیر
   - دیتابیس Supabase رو بک‌آپ بگیر

4. **مانیتورینگ:**
   - از PM2 Monitor استفاده کن
   - لاگ‌ها رو چک کن

---

## 🔄 آپدیت پروژه

```powershell
cd C:\inetpub\wwwroot\lent-shop
git pull  # اگر از Git استفاده می‌کنی
npm install
npm run build
pm2 restart lent-shop-api
```

---

## 📞 پشتیبانی

اگر مشکلی پیش اومد:
1. لاگ‌های PM2 رو چک کن: `pm2 logs`
2. لاگ‌های IIS رو چک کن
3. فایل‌های `.env` رو دوباره چک کن


