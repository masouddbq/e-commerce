# Final Prompt for AI (English - Short)

## Problem Summary

I have a React SPA on IIS with Express.js backend. Product routes `/product/:brand/:productId` should be rewritten to Express for SSR with meta tags.

**What works:**
- Express server works: `curl http://localhost:4000/api/product/toyota/996` returns HTML with meta tags ✅
- Express logs show meta tags are injected correctly ✅
- `web.config` is correctly configured with rule "Product SSR Proxy" ✅
- Server-level rules checked multiple times - NO rules exist at server level ✅

**What doesn't work:**
- `curl https://lent-shop.ir/product/toyota/996` returns only 41 characters (should be thousands) ❌
- No `X-SSR` header in response ❌
- No `product_id` meta tag in response ❌
- Response length: 41 characters (should be 3000+)

**Current configuration:**
- IIS with URL Rewrite Module and ARR enabled
- `web.config` at `C:\e-commerce\dist\web.config` contains:
  ```xml
  <rule name="Product SSR Proxy" stopProcessing="true">
    <match url="^product/.*" />
    <action type="Rewrite" url="http://localhost:4000/api/{R:0}" />
  </rule>
  ```
- ARR Proxy is enabled
- Disk Cache is disabled
- Server-level rules: NONE (checked multiple times)

**The issue:**
Even though:
- Express works correctly
- `web.config` is correct
- No server-level rules exist
- ARR is enabled

The IIS rewrite rule is NOT executing. The request is NOT reaching Express. Response is only 41 characters (likely an error or redirect).

**What we've tried:**
1. Simplified `web.config` to single rule
2. Changed from `AbortRequest` to `CustomResponse 404` to simple rewrite
3. Disabled ARR Disk Cache
4. Checked server-level rules multiple times (none exist)
5. Verified rule order in site-level
6. Restarted IIS multiple times
7. Added `X-SSR` header to Express (works when accessed directly)
8. Pattern test in IIS Manager shows rule matches correctly

**Current status:**
- Pattern test: ✅ Matches
- Express direct: ✅ Works
- IIS rewrite: ❌ Not executing
- Server-level rules: ✅ None exist

Please provide a solution in **Persian (Farsi)** that:
1. Diagnoses why the rewrite rule is not executing despite correct configuration
2. Provides step-by-step fix instructions
3. Includes verification steps

