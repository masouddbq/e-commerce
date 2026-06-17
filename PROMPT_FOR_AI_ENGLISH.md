# Prompt for AI Assistant (English)

## Problem Description

I have an e-commerce website with the following architecture:

**Frontend:**
- React SPA built with Vite
- Deployed on IIS (Windows Server 2012 R2)
- Domain: `https://lent-shop.ir`
- Physical Path: `C:\e-commerce\dist`

**Backend:**
- Express.js server running on Node.js
- Port: 4000 (localhost)
- Managed with PM2
- Route: `/api/product/:brand/:productId` returns HTML with meta tags for SEO and Torob

**Web Server:**
- IIS with URL Rewrite Module
- Application Request Routing (ARR) installed
- SSL/HTTPS enabled

## Current Situation

### ✅ What Works:

1. **Express Server is Working:**
   - Direct access to `http://localhost:4000/api/product/toyota/996` returns HTML with all meta tags
   - Meta tags include: `product_id`, `product_name`, `product_price`, `availability`, `og:title`, `og:description`, etc.
   - Express server is running correctly with PM2

2. **web.config File:**
   - Located at: `C:\e-commerce\dist\web.config`
   - Contains rewrite rules for product pages
   - Rules are defined correctly in the file

### ❌ What Doesn't Work:

1. **IIS Rewrite Rules Not Executing:**
   - When accessing `https://lent-shop.ir/product/toyota/996`, the request does NOT reach Express
   - Instead, React SPA HTML is returned (with `<div id="root">` but no meta tags)
   - Meta tags are NOT present in the response

2. **IIS Manager Shows Rules:**
   - Rules are visible in IIS Manager under URL Rewrite → Inbound Rules
   - Rule order (from top to bottom):
     1. SSR Product Pages
     2. Ignore Product for SPA
     3. React Router
   - Pattern test in IIS Manager shows the pattern matches correctly

3. **Test Results:**
   ```powershell
   # This works (Express):
   curl.exe http://localhost:4000/api/product/toyota/996
   # Returns: HTML with meta tags ✅
   
   # This doesn't work (IIS):
   curl.exe -s https://lent-shop.ir/product/toyota/996 | Select-String "product_id"
   # Returns: Empty (no product_id found) ❌
   ```

## Configuration Details

### web.config Structure:
```xml
<rule name="SSR Product Pages" stopProcessing="true">
  <match url="^product/([^/]+)/([^/]+)$" />
  <conditions logicalGrouping="MatchAll">
    <add input="{HTTPS}" pattern="on" />
  </conditions>
  <action type="Rewrite" url="http://localhost:4000/api/product/{R:1}/{R:2}" />
</rule>

<rule name="Ignore Product for SPA" stopProcessing="true">
  <match url="^product/.*" />
  <action type="None" />
</rule>

<rule name="React Router" stopProcessing="true">
  <match url=".*" />
  <conditions>
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
    <add input="{REQUEST_URI}" pattern="^/product/" negate="true" />
  </conditions>
  <action type="Rewrite" url="/index.html" />
</rule>
```

### ARR Settings:
- Enable Proxy: ✅ Enabled
- Preserve client IP in X-Forwarded-For: ✅ Enabled
- Reverse rewrite host in response headers: ✅ Enabled

## Problem Analysis

The issue appears to be that:
1. Express server works correctly when accessed directly
2. IIS Rewrite rules are configured and visible in IIS Manager
3. Pattern matching works in IIS Manager's test tool
4. BUT: When accessing the site through IIS, the rewrite rule does NOT execute
5. Instead, the React Router rule catches the request and serves `/index.html`

## What I Need

Please provide a solution in **Persian (Farsi)** that:

1. **Diagnoses why the IIS Rewrite rule is not executing** even though:
   - The pattern matches correctly
   - The rule is in the correct order (before React Router)
   - ARR Proxy is enabled

2. **Provides step-by-step fix instructions** including:
   - How to verify the rule is actually being executed
   - How to check if there are conflicting rules at Server level
   - How to ensure the rewrite happens before React Router catches it
   - Any IIS configuration that might be blocking the rewrite

3. **Includes verification steps** to confirm the fix works:
   - How to test that requests reach Express
   - How to verify meta tags are in the response
   - How to check logs if needed

4. **Considers common issues** such as:
   - Server-level rules overriding site-level rules
   - Caching issues
   - ARR configuration problems
   - Rule execution order problems
   - HTTPS/SSL certificate issues affecting rewrites

## Additional Context

- Windows Server 2012 R2
- IIS 8.5
- URL Rewrite Module 2.1
- Application Request Routing 3.0
- The site uses HTTPS (SSL certificate is valid)
- Express server is running and accessible on localhost:4000
- PM2 is managing the Express process

## Expected Outcome

After the fix:
- Accessing `https://lent-shop.ir/product/toyota/996` should return HTML with meta tags
- The request should be rewritten to `http://localhost:4000/api/product/toyota/996`
- Express should process the request and return HTML with meta tags
- Meta tags should be visible in View Source (without JavaScript)

Please provide the solution in **Persian (Farsi)** language.

