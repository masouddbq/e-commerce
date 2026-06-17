# 🔧 راهنمای کامل رفع مشکل IIS + ARR + HTTPS

## 🎯 مشکل اصلی

IIS به‌صورت پیش‌فرض **outbound proxy روی HTTPS را Block می‌کند**. این باعث می‌شود:
- ✅ Pattern match می‌شود
- ✅ Rule دیده می‌شود  
- ❌ اما Action اجرا نمی‌شود
- ❌ فقط 41 کاراکتر (SPA fallback) برمی‌گردد

---

## 🟢 مرحله 1: فعال‌سازی Allow Double Escaping

### گام 1: باز کردن IIS Manager

1. **Windows Key + R** بزنید
2. تایپ کنید: `inetmgr`
3. Enter بزنید

### گام 2: رفتن به Request Filtering

1. در **سمت چپ**، روی **نام سرور** کلیک کنید (نه روی سایت)
   - مثلاً: `WIN-XXXXX` یا نام سرور شما
2. در **سمت راست**، **Request Filtering** را پیدا کنید
3. **دوبار کلیک** کنید

### گام 3: ویرایش Feature Settings

1. در **سمت راست**، روی **Edit Feature Settings** کلیک کنید
2. در پنجره باز شده:
   - ✅ **Allow double escaping** را تیک بزنید
   - ✅ **Allow unescaped percent sign** را تیک بزنید
3. **OK** بزنید

### گام 4: Restart IIS

```powershell
iisreset
```

**✅ اگر این مرحله را انجام ندهید، Rewrite خارجی روی HTTPS ناقص اجرا می‌شود.**

---

## 🟢 مرحله 2: خاموش‌کردن Failed Request Caching برای Rewrite

### گام 1: باز کردن Configuration Editor

1. در IIS Manager، روی **نام سایت** کلیک کنید
   - مثلاً: `lent-shop.ir` یا `Default Web Site`
2. در **سمت راست**، **Configuration Editor** را پیدا کنید
3. **دوبار کلیک** کنید

### گام 2: تنظیم Rewrite

1. در **Section**، این مسیر را انتخاب کنید:
   ```
   system.webServer/rewrite
   ```
2. در **سمت راست**، **allowUnescapedCharacters** را پیدا کنید
3. مقدار را به **true** تغییر دهید
4. **Apply** بزنید

### گام 3: Restart IIS

```powershell
iisreset
```

---

## 🟢 مرحله 3: تست Proxy مستقیم (بدون Rewrite)

### گام 1: اضافه کردن Rule تست در web.config

**قبل از Rule "Product SSR Proxy"**، این Rule را اضافه کنید:

```xml
<rule name="TEST PROXY" stopProcessing="true">
  <match url="^api/(.*)$" />
  <action type="Rewrite" url="http://localhost:4000/api/{R:1}" />
</rule>
```

**web.config کامل برای تست:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <proxy enabled="true" preserveHostHeader="true" />
    <handlers>
      <clear />
      <add name="StaticFile" path="*" verb="*" 
           modules="StaticFileModule" resourceType="Either" requireAccess="Read" />
    </handlers>
    <rewrite>
      <rules>
        <!-- تست Proxy مستقیم -->
        <rule name="TEST PROXY" stopProcessing="true">
          <match url="^api/(.*)$" />
          <action type="Rewrite" url="http://localhost:4000/api/{R:1}" />
        </rule>
        
        <!-- SSR for product -->
        <rule name="Product SSR Proxy" stopProcessing="true">
          <match url="^product/.*" />
          <action type="Rewrite" url="http://localhost:4000/api/{R:0}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### گام 2: Restart IIS

```powershell
iisreset
```

### گام 3: تست در مرورگر سرور

1. روی سرور، **مرورگر** را باز کنید
2. این آدرس را بزنید:
   ```
   https://lent-shop.ir/api/product/toyota/996
   ```
3. **View Source** کنید (Ctrl+U)
4. بررسی کنید:
   - ✅ آیا `product_id` در HTML هست؟
   - ✅ آیا `X-SSR: EXPRESS-HIT` در Response Headers هست؟

**نتیجه:**
- ✅ اگر کار کرد → مشکل از Rewrite Pattern است
- ❌ اگر کار نکرد → مشکل 100% از ARR / HTTPS / Proxy است

---

## 🟢 مرحله 4: فعال‌سازی Log واقعی Rewrite (Debug نهایی)

### گام 1: فعال‌سازی Failed Request Tracing

1. در IIS Manager، روی **نام سایت** کلیک کنید
2. در **سمت راست**، **Failed Request Tracing** را پیدا کنید
3. **دوبار کلیک** کنید

### گام 2: تنظیم Tracing Rules

1. در **سمت راست**، روی **Edit Site Tracing...** کلیک کنید
2. در پنجره باز شده:
   - ✅ **Enable** را تیک بزنید
   - **Status code(s):** `200-999` را وارد کنید
   - **Verbosity:** `Verbose` را انتخاب کنید
3. **OK** بزنید

### گام 3: تست و بررسی Log

1. در مرورگر سرور، این آدرس را بزنید:
   ```
   https://lent-shop.ir/product/toyota/996
   ```

2. **Log را بررسی کنید:**
   ```
   C:\inetpub\logs\FailedReqLogFiles\W3SVC[SiteID]\fr[timestamp].xml
   ```

   **راه ساده برای پیدا کردن Site ID:**
   ```powershell
   Get-WebSite | Select-Object Name, Id
   ```

3. **در Log دنبال این بگردید:**
   - `REWRITE_ACTION` → باید `Rewrite` باشد
   - `REWRITE_URL` → باید `http://localhost:4000/api/product/toyota/996` باشد
   - `PROXY_*` → باید اطلاعات Proxy باشد

**🔴 اگر Rewrite اجرا نشده باشد، صراحتاً در لاگ نوشته می‌شود.**

---

## 📋 چک‌لیست کامل

### قبل از تست

- [ ] مرحله 1: Allow Double Escaping فعال شد
- [ ] مرحله 1: Allow unescaped percent sign فعال شد
- [ ] مرحله 1: IIS restart شد
- [ ] مرحله 2: allowUnescapedCharacters = true شد
- [ ] مرحله 2: IIS restart شد
- [ ] مرحله 3: Rule TEST PROXY اضافه شد
- [ ] مرحله 3: IIS restart شد
- [ ] مرحله 4: Failed Request Tracing فعال شد

### تست‌ها

- [ ] تست 1: `https://lent-shop.ir/api/product/toyota/996` کار می‌کند؟
- [ ] تست 2: `https://lent-shop.ir/product/toyota/996` کار می‌کند؟
- [ ] تست 3: Log نشان می‌دهد Rewrite اجرا شده؟

---

## 🧪 تست‌های PowerShell

### تست 1: بررسی Allow Double Escaping

```powershell
# بررسی تنظیمات Request Filtering
$config = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "allowDoubleEscaping"
Write-Host "Allow Double Escaping: $($config.Value)"
```

**باید ببینید:** `True`

### تست 2: بررسی allowUnescapedCharacters

```powershell
# بررسی تنظیمات Rewrite
$config = Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/rewrite" -Name "allowUnescapedCharacters"
Write-Host "Allow Unescaped Characters: $($config.Value)"
```

**باید ببینید:** `True`

### تست 3: تست Proxy مستقیم

```powershell
# تست از طریق /api/
$result = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/toyota/996" -UseBasicParsing
Write-Host "Status: $($result.StatusCode)"
Write-Host "X-SSR Header: $($result.Headers['X-SSR'])"
if ($result.Content -match "product_id") {
    Write-Host "✅ SUCCESS: product_id found"
} else {
    Write-Host "❌ FAIL: product_id not found"
}
```

### تست 4: تست Product Route

```powershell
# تست از طریق /product/
$result = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -UseBasicParsing
Write-Host "Status: $($result.StatusCode)"
Write-Host "X-SSR Header: $($result.Headers['X-SSR'])"
Write-Host "Content Length: $($result.Content.Length)"
if ($result.Content -match "product_id") {
    Write-Host "✅ SUCCESS: product_id found"
} else {
    Write-Host "❌ FAIL: product_id not found"
    Write-Host "First 200 chars: $($result.Content.Substring(0, 200))"
}
```

---

## 🎯 نتیجه‌گیری

### اگر بعد از این مراحل کار کرد:

✅ مشکل حل شد!  
✅ Rule TEST PROXY را حذف کنید  
✅ فقط Rule "Product SSR Proxy" را نگه دارید

### اگر هنوز کار نکرد:

❌ مشکل 100% از ARR / HTTPS / Proxy است  
❌ IIS برای SSR شما مناسب نیست  
✅ پیشنهاد: استفاده از Nginx به‌عنوان Reverse Proxy جلوی IIS

---

## 📝 نکات مهم

1. **مرحله 1 و 2 خیلی مهم هستند** - بدون آن‌ها، Rewrite روی HTTPS کار نمی‌کند
2. **Rule TEST PROXY** فقط برای تست است - بعد از تست حذف کنید
3. **Failed Request Tracing** را بعد از تست خاموش کنید (برای Performance)
4. **همیشه بعد از تغییرات IIS را restart کنید**

---

## 🔧 اگر نیاز به کمک دارید

نتیجه این دستورات را بفرستید:

```powershell
# 1. بررسی Allow Double Escaping
Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "allowDoubleEscaping"

# 2. بررسی allowUnescapedCharacters
Get-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/rewrite" -Name "allowUnescapedCharacters"

# 3. تست Proxy مستقیم
$result = Invoke-WebRequest -Uri "https://lent-shop.ir/api/product/toyota/996" -UseBasicParsing
Write-Host "Status: $($result.StatusCode)"
Write-Host "X-SSR: $($result.Headers['X-SSR'])"
Write-Host "Content Length: $($result.Content.Length)"
Write-Host "Has product_id: $($result.Content -match 'product_id')"

# 4. تست Product Route
$result2 = Invoke-WebRequest -Uri "https://lent-shop.ir/product/toyota/996" -UseBasicParsing
Write-Host "Status: $($result2.StatusCode)"
Write-Host "X-SSR: $($result2.Headers['X-SSR'])"
Write-Host "Content Length: $($result2.Content.Length)"
Write-Host "Has product_id: $($result2.Content -match 'product_id')"
```

