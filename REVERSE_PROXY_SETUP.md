# راهنمای کامل Reverse Proxy با ARR در IIS

## 🔧 تنظیمات Reverse Proxy

### مرحله 1: فعال‌سازی ARR Proxy

1. در IIS Manager، روی **نام سرور** کلیک کنید (نه سایت)
2. **Application Request Routing Cache** → **Server Proxy Settings**
3. تیک **Enable proxy** را بزنید ✓
4. **Apply** کنید

---

### مرحله 2: ایجاد Reverse Proxy Rule

#### روش 1: استفاده از Reverse Proxy Wizard

1. در IIS Manager، روی **سایت lent-shop** کلیک کنید
2. **URL Rewrite** را باز کنید
3. **Add Rule(s)...** → **Reverse Proxy**
4. در پنجره **Add Reverse Proxy Rule**:

**Inbound rule:**
```
^product/([^/]+)/([^/]+)$
```

**Enter the server name or the IP address:**
```
127.0.0.1:4000
```
یا:
```
87.107.152.3:4000
```

**⚠️ مهم:** فقط IP یا hostname را وارد کنید (نه URL کامل)

5. تیک **Enable SSL Offloading** را بزنید (اگر از HTTPS استفاده نمی‌کنید، می‌توانید خالی بگذارید)
6. **OK** را کلیک کنید

---

#### روش 2: استفاده از Blank Rule (پیشنهادی)

1. **Add Rule(s)...** → **Blank Rule**
2. تنظیمات:

**Name:**
```
Product Pages Reverse Proxy
```

**Pattern:**
```
^product/([^/]+)/([^/]+)$
```

**Action type:**
```
Rewrite
```

**Action URL:**
```
http://127.0.0.1:4000/product/{R:1}/{R:2}
```

یا:
```
http://87.107.152.3:4000/product/{R:1}/{R:2}
```

**Server Variables:**
- `HTTP_ACCEPT_ENCODING` (Value خالی)

3. **Apply** کنید

---

### مرحله 3: تنظیمات Outbound Rules (اختیاری)

اگر می‌خواهید response headers را rewrite کنید:

1. به تب **Outbound Rules** بروید
2. **Add Rule(s)...** → **Blank Rule**
3. تنظیمات:
   - **Name:** `Rewrite Response Headers`
   - **Pattern:** `(.*)`
   - **Action type:** `Rewrite`
   - **Value:** `{R:1}`

---

### مرحله 4: بررسی ترتیب Rule ها

**مهم:** Rule Reverse Proxy باید قبل از React Router rule باشد!

1. در IIS Manager، rule ها را ببینید
2. Rule **"Product Pages Reverse Proxy"** باید قبل از **"React Router"** باشد
3. اگر نیست، از دکمه **↑ Move Up** استفاده کنید

---

### مرحله 5: Restart IIS

```powershell
iisreset
```

---

### مرحله 6: تست

```powershell
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

---

## 🔍 عیب‌یابی

### مشکل: خطای 502 Bad Gateway

**راه‌حل:**
1. بررسی کنید که سرور Express در حال اجرا است: `pm2 status`
2. بررسی کنید که پورت 4000 باز است
3. بررسی کنید که ARR proxy فعال است

---

### مشکل: خطای 404 Not Found

**راه‌حل:**
1. بررسی کنید که Pattern درست است
2. بررسی کنید که Action URL درست است
3. بررسی کنید که rule قبل از React Router rule است

---

### مشکل: Rule کار نمی‌کند

**راه‌حل:**
1. بررسی کنید که ARR proxy فعال است
2. بررسی کنید که rule در IIS Manager وجود دارد
3. بررسی کنید که ترتیب rule ها درست است
4. IIS را restart کنید

---

## 📋 web.config کامل برای Reverse Proxy

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- مستثنی کردن فایل‌های استاتیک -->
        <rule name="Static Files" stopProcessing="true">
          <match url="^(assets|_next|static|favicon|images|fonts|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|pdf))" />
          <action type="None" />
        </rule>
        
        <!-- Reverse Proxy برای صفحات محصول -->
        <rule name="Product Pages Reverse Proxy" stopProcessing="true">
          <match url="^product/([^/]+)/([^/]+)$" />
          <conditions logicalGrouping="MatchAll" trackAllCaptures="false">
          </conditions>
          <action type="Rewrite" url="http://127.0.0.1:4000/product/{R:1}/{R:2}" />
          <serverVariables>
            <set name="HTTP_ACCEPT_ENCODING" value="" />
          </serverVariables>
        </rule>
        
        <!-- React Router -->
        <rule name="React Router" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/api/" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/payment/" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## ✅ چک‌لیست

- [ ] ARR نصب شده است
- [ ] ARR proxy فعال است (Server Proxy Settings → Enable proxy)
- [ ] Reverse Proxy rule ایجاد شده است
- [ ] Pattern درست است: `^product/([^/]+)/([^/]+)$`
- [ ] Action URL درست است: `http://127.0.0.1:4000/product/{R:1}/{R:2}`
- [ ] Rule قبل از React Router rule است
- [ ] Server Variables اضافه شده است
- [ ] IIS restart شده است

---

## 🎯 تست نهایی

```powershell
# تست مستقیم سرور Express
Invoke-WebRequest -Uri "http://127.0.0.1:4000/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"

# تست از طریق Reverse Proxy
Invoke-WebRequest -Uri "http://localhost/product/mg/349" | Select-Object -ExpandProperty Content | Select-String "product_id"
```

هر دو تست باید `product_id` را پیدا کنند.

