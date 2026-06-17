# 🚨 رفع فوری مشکل web.config

## ⚠️ مشکل:

فایل `web.config` در سرور شما rule "Torob Products and Sitemap" را ندارد!

## ✅ راه‌حل:

### روش 1: استفاده از فایل آماده (توصیه می‌شود)

1. فایل `web.config.CORRECT` را در ریشه پروژه باز کنید
2. محتوای آن را کپی کنید
3. در سرور، فایل `web.config` را باز کنید (در مسیر `C:\inetpub\wwwroot\lent-shop\web.config`)
4. همه محتوا را با محتوای فایل `web.config.CORRECT` جایگزین کنید
5. ذخیره کنید

### روش 2: اضافه کردن rule دستی

در فایل `web.config` سرور، **قبل از** rule "Static Files"، این rule را اضافه کنید:

```xml
<!-- Proxy صفحه لیست محصولات ترب و sitemap به سرور Express -->
<!-- این rule باید قبل از Static Files باشد تا sitemap.xml به Express برود -->
<rule name="Torob Products and Sitemap" stopProcessing="true">
  <match url="^(torob-products|sitemap\.xml)$" />
  <action type="Rewrite" url="http://localhost:4000/{R:0}" />
  <serverVariables>
    <set name="HTTP_ACCEPT_ENCODING" value="" />
  </serverVariables>
</rule>
```

**و همچنین** در rule "Static Files"، XML را از pattern حذف کنید:

**قبل:**
```xml
<match url="^(assets|_next|static|favicon|images|fonts|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|xml|txt|pdf))" />
```

**بعد:**
```xml
<match url="^(assets|_next|static|favicon|images|fonts|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|txt|pdf))" />
```

(توجه: `xml` را حذف کنید)

**و همچنین** در rule "React Router"، این دو خط را اضافه کنید:

```xml
<add input="{REQUEST_URI}" pattern="^/torob-products" negate="true" />
<add input="{REQUEST_URI}" pattern="^/sitemap\.xml" negate="true" />
```

---

## 🔄 بعد از تغییر:

### 1. Restart IIS:
```powershell
iisreset
```

### 2. بررسی کنید:
- `https://lent-shop.ir/torob-products` کار می‌کند
- `https://lent-shop.ir/sitemap.xml` کار می‌کند و شامل محصولات است

---

## 📋 چک‌لیست:

- [ ] rule "Torob Products and Sitemap" اضافه شده است
- [ ] rule "Torob Products and Sitemap" **قبل از** "Static Files" است
- [ ] XML از pattern "Static Files" حذف شده است
- [ ] rule "React Router" شامل مستثنی‌های torob-products و sitemap.xml است
- [ ] IIS restart شده است

---

## ✅ تمام!

بعد از این تغییرات، لینک‌ها باید کار کنند! 🎉

