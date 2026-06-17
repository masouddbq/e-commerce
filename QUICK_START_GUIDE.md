# 🚀 راهنمای سریع - رفع مشکل IIS + ARR + HTTPS

## 📋 خلاصه مراحل

### ✅ مرحله 1: اجرای اسکریپت خودکار

```powershell
# به عنوان Administrator اجرا کنید
.\fix-iis-arr-https.ps1
```

**این اسکریپت:**
- ✅ Allow Double Escaping را فعال می‌کند
- ✅ Allow unescaped percent sign را فعال می‌کند
- ✅ IIS را restart می‌کند

---

### ✅ مرحله 2: تنظیم دستی allowUnescapedCharacters

**اگر اسکریپت نتوانست این را تنظیم کند:**

1. **IIS Manager** را باز کنید (`inetmgr`)
2. روی **نام سایت** کلیک کنید
3. **Configuration Editor** را باز کنید
4. **Section:** `system.webServer/rewrite`
5. **allowUnescapedCharacters** = `true`
6. **Apply** → **iisreset**

---

### ✅ مرحله 3: اضافه کردن Rule تست

**فایل `web.config.test` را به `web.config` تبدیل کنید:**

```powershell
# Backup از web.config فعلی
Copy-Item "C:\e-commerce\dist\web.config" "C:\e-commerce\dist\web.config.backup"

# کپی web.config.test به web.config
Copy-Item "web.config.test" "C:\e-commerce\dist\web.config"
```

**یا به صورت دستی Rule TEST PROXY را اضافه کنید** (قبل از Rule "Product SSR Proxy"):

```xml
<rule name="TEST PROXY" stopProcessing="true">
  <match url="^api/(.*)$" />
  <action type="Rewrite" url="http://localhost:4000/api/{R:1}" />
</rule>
```

**سپس:**
```powershell
iisreset
```

---

### ✅ مرحله 4: تست

```powershell
# اجرای تست‌ها
.\test-iis-arr-https.ps1
```

**یا تست دستی:**

```powershell
# تست 1: Express مستقیم
curl.exe -s http://localhost:4000/api/product/toyota/996 | findstr "product_id"

# تست 2: Proxy مستقیم (/api/)
curl.exe -s https://lent-shop.ir/api/product/toyota/996 | findstr "product_id"

# تست 3: Product Route (/product/)
curl.exe -s https://lent-shop.ir/product/toyota/996 | findstr "product_id"
```

---

### ✅ مرحله 5: فعال‌سازی Failed Request Tracing (اختیاری)

**برای Debug دقیق:**

1. **IIS Manager** → **نام سایت**
2. **Failed Request Tracing** → **Edit Site Tracing...**
3. ✅ **Enable**
4. **Status code(s):** `200-999`
5. **Verbosity:** `Verbose`
6. **OK**

**سپس:**
- `https://lent-shop.ir/product/toyota/996` را در مرورگر باز کنید
- Log را بررسی کنید: `C:\inetpub\logs\FailedReqLogFiles\W3SVC[SiteID]\`

---

## 🎯 نتیجه‌گیری

### ✅ اگر تست 2 موفق بود (Proxy مستقیم کار کرد):

→ Rule TEST PROXY را حذف کنید  
→ فقط Rule "Product SSR Proxy" را نگه دارید  
→ مشکل حل شد!

### ❌ اگر تست 2 ناموفق بود:

→ مشکل 100% از ARR / HTTPS / Proxy است  
→ مراحل 1 و 2 را دوباره بررسی کنید  
→ یا از Nginx به‌عنوان Reverse Proxy استفاده کنید

---

## 📝 فایل‌های مهم

1. **FIX_IIS_ARR_HTTPS.md** - راهنمای کامل و تفصیلی
2. **fix-iis-arr-https.ps1** - اسکریپت خودکار برای مراحل 1 و 2
3. **test-iis-arr-https.ps1** - اسکریپت تست کامل
4. **web.config.test** - web.config با Rule TEST PROXY
5. **web.config** - web.config نهایی (بدون Rule تست)

---

## ⚠️ نکات مهم

1. **همیشه به عنوان Administrator اجرا کنید**
2. **بعد از هر تغییر IIS را restart کنید**
3. **Rule TEST PROXY را بعد از تست حذف کنید**
4. **Failed Request Tracing را بعد از تست خاموش کنید**

