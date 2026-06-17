/* eslint-env node */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { otpRouter } from './routes/otp.js';
import { paymentRouter } from './routes/payment.js';
import { salesRouter } from './routes/sales.js';
import { ordersRouter } from './routes/orders.js';
import { authRouter } from './routes/auth.js';
import { commentsRouter } from './routes/comments.js';
import supabaseAdmin from './supabaseAdminClient.js';
import { verifyPayment } from './services/zarinpalService.js';
import { sendOrderConfirmationSms } from './sms/farazSmsClient.js';
import process from 'node:process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();

const {
  PORT = 4000,
  NODE_ENV,
  CLIENT_ORIGIN,
} = process.env;

const corsOrigins = CLIENT_ORIGIN
  ? CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

// اضافه کردن دامنه production به صورت خودکار
// همیشه دامنه‌های production را اضافه می‌کنیم (حتی اگر NODE_ENV تنظیم نشده باشد)
const productionOrigins = [
  'https://lent-shop.ir',
  'http://lent-shop.ir',
  'https://www.lent-shop.ir',
  'http://www.lent-shop.ir'
];
productionOrigins.forEach(origin => {
  if (!corsOrigins.includes(origin)) {
    corsOrigins.push(origin);
  }
});

console.log('[Server] CORS Origins:', corsOrigins);
console.log('[Server] NODE_ENV:', NODE_ENV);
console.log('[Server] CLIENT_ORIGIN:', CLIENT_ORIGIN);

// ⭐ تنظیمات کامل CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    if (corsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('[CORS] ⚠️ Blocked origin:', origin);
      console.warn('[CORS] Allowed origins:', corsOrigins);
      // در development، همه را مجاز کن
      if (NODE_ENV === 'development') {
        console.warn('[CORS] Development mode - allowing anyway');
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());

// ⭐ Handle OPTIONS requests برای CORS
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin && corsOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // اگر origin نداریم، همه را مجاز کن
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204);
});

// ⭐ Middleware برای لاگ کردن همه درخواست‌ها (برای دیباگ)
app.use((req, res, next) => {
  // لاگ کردن همه درخواست‌ها (برای دیباگ کامل)
  const isProductRoute = req.path.match(/^\/product\//) || req.path.match(/^\/api\/product\//);
  const shouldLog = req.path.startsWith('/api/') || isProductRoute || req.path.startsWith('/product/');
  
  if (shouldLog) {
    console.log('[DEBUG] ⚡ Request received:', { method: req.method, path: req.path, url: req.url, isProductRoute: !!isProductRoute, host: req.headers.host, userAgent: req.headers['user-agent']?.substring(0, 50) });
    // #region agent log
    try {
      const logDir = join(__dirname, '..', '.cursor');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
      const logPath = join(logDir, 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:112',message:'Request received',data:{path:req.path,method:req.method,userAgent:req.headers['user-agent'],host:req.headers.host,url:req.url,isProductRoute:!!isProductRoute,isProductPath:req.path.startsWith('/product/')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {
      console.error('[DEBUG] Log write error:', e);
    }
    // #endregion
  }
  
  if (req.path.startsWith('/api/')) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  }
  
  if (req.path.startsWith('/product/')) {
    console.log('[DEBUG] Product Request:', { method: req.method, path: req.path, url: req.url });
    // #region agent log
    try {
      const logDir = join(__dirname, '..', '.cursor');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
      const logPath = join(logDir, 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:130',message:'Product request received',data:{path:req.path,method:req.method,userAgent:req.headers['user-agent'],host:req.headers.host,url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {
      console.error('[DEBUG] Log write error:', e);
    }
    // #endregion
  }
  next();
});

if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ⭐ Route تست برای بررسی اینکه Express کار می‌کند
app.get('/api/test', (_req, res) => {
  console.log('[TEST] /api/test route hit');
  // #region agent log
  try {
    const logDir = join(__dirname, '..', '.cursor');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    const logPath = join(logDir, 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:138',message:'Test route hit',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {
    console.error('[DEBUG] Log write error:', e);
  }
  // #endregion
  res.json({ 
    status: 'ok', 
    message: 'Express server is working',
    timestamp: new Date().toISOString(),
    routes: ['/api/test', '/api/product/:brand/:productId', '/api/product/:brand/:productId/html']
  });
});

// ⭐ Route تست برای بررسی اینکه Express کار می‌کند
app.get('/api/test', (_req, res) => {
  // #region agent log
  try {
    const logPath = join(__dirname, '..', '.cursor', 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:130',message:'Test route hit',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {
    console.error('[Debug] Log write error:', e);
  }
  // #endregion
  console.log('[TEST] /api/test route hit');
  res.json({ 
    status: 'ok', 
    message: 'Express server is working',
    timestamp: new Date().toISOString(),
    routes: ['/api/test', '/api/product/:brand/:productId', '/api/product/:brand/:productId/html']
  });
});

// ⭐ Route تستی برای بررسی مستقیم product route (بدون نیاز به IIS rewrite)
// این route برای تست است تا ببینیم آیا Express route کار می‌کند
app.get('/api/test-product/:brand/:productId', async (req, res) => {
  console.log('[DEBUG] ⭐ /api/test-product route HIT!', { brand: req.params.brand, productId: req.params.productId });
  // #region agent log
  try {
    const logDir = join(__dirname, '..', '.cursor');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    const logPath = join(logDir, 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:210',message:'Test product route hit',data:{productId:req.params.productId,brand:req.params.brand,url:req.url,path:req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {
    console.error('[DEBUG] Log write error:', e);
  }
  // #endregion
  res.json({ 
    status: 'ok', 
    message: 'Test product route is working',
    brand: req.params.brand,
    productId: req.params.productId,
    timestamp: new Date().toISOString()
  });
});

// ⭐ Route برای رندر کردن HTML صفحات محصول با متاتگ‌های ترب
// این route باید قبل از route های React Router اجرا شود
// Route اصلی برای ربات‌ها
app.get('/product/:brand/:productId', async (req, res) => {
  console.log('[DEBUG] ⭐ /product/:brand/:productId route HIT!', { brand: req.params.brand, productId: req.params.productId, url: req.url });
  // #region agent log
  try {
    const logDir = join(__dirname, '..', '.cursor');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    const logPath = join(logDir, 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:214',message:'Route hit - product page request',data:{productId:req.params.productId,brand:req.params.brand,userAgent:req.headers['user-agent'],url:req.url,path:req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {
    console.error('[DEBUG] Log write error in product route:', e);
  }
  // #endregion
  try {
    const { productId, brand } = req.params;
    
    // دریافت اطلاعات محصول از دیتابیس
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:143',message:'Database query result',data:{productId,hasProduct:!!product,hasError:!!error,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    if (error || !product) {
      // #region agent log
      try {
        const logPath = join(__dirname, '..', '.cursor', 'debug.log');
        const logData = JSON.stringify({location:'server/index.js:143',message:'Product not found - redirecting',data:{productId,brand,error:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}) + '\n';
        appendFileSync(logPath, logData, 'utf8');
      } catch (e) {}
      // #endregion
      // اگر محصول پیدا نشد، به frontend redirect کن
      const frontendUrl = CLIENT_ORIGIN 
        ? CLIENT_ORIGIN.split(',')[0].trim() 
        : 'https://lent-shop.ir';
      return res.redirect(`${frontendUrl}/product/${brand}/${productId}`);
    }

    // خواندن فایل index.html
    const indexPath = join(__dirname, '..', 'dist', 'index.html');
    let html = '';
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:152',message:'Checking index.html file',data:{indexPath,indexExists:existsSync(indexPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    
    if (existsSync(indexPath)) {
      html = readFileSync(indexPath, 'utf-8');
      // #region agent log
      try {
        const logPath = join(__dirname, '..', '.cursor', 'debug.log');
        const logData = JSON.stringify({location:'server/index.js:156',message:'HTML file read from dist',data:{htmlLength:html.length,hasHeadTag:html.includes('</head>')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}) + '\n';
        appendFileSync(logPath, logData, 'utf8');
      } catch (e) {}
      // #endregion
    } else {
      // اگر فایل dist وجود نداشت، از index.html اصلی استفاده کن
      const fallbackPath = join(__dirname, '..', 'index.html');
      if (existsSync(fallbackPath)) {
        html = readFileSync(fallbackPath, 'utf-8');
        // #region agent log
        try {
          const logPath = join(__dirname, '..', '.cursor', 'debug.log');
          const logData = JSON.stringify({location:'server/index.js:161',message:'HTML file read from fallback',data:{htmlLength:html.length,hasHeadTag:html.includes('</head>')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}) + '\n';
          appendFileSync(logPath, logData, 'utf8');
        } catch (e) {}
        // #endregion
      } else {
        // #region agent log
        try {
          const logPath = join(__dirname, '..', '.cursor', 'debug.log');
          const logData = JSON.stringify({location:'server/index.js:163',message:'HTML file not found',data:{indexPath,fallbackPath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}) + '\n';
          appendFileSync(logPath, logData, 'utf8');
        } catch (e) {}
        // #endregion
        return res.status(404).send('HTML file not found');
      }
    }

    // تبدیل قیمت‌ها به عدد (حذف کاما و کاراکترهای غیر عددی)
    const cleanPrice = (price) => {
      if (!price) return '0';
      return price.toString().replace(/[^\d]/g, '');
    };

    const productPrice = cleanPrice(product.price || '0');
    const productOldPrice = cleanPrice(product.originalPrice || product.price || '0');
    
    // تعیین وضعیت موجودی
    const stockStatus = product.stockStatus === 'موجود' || (product.stockCount && product.stockCount > 0) 
      ? 'instock' 
      : 'outofstock';
    
    // دریافت URL کامل تصویر محصول
    const imageUrl = product.image 
      ? (product.image.startsWith('http') ? product.image : `https://lent-shop.ir${product.image}`)
      : 'https://lent-shop.ir/favicon.svg';
    
    // دریافت گارانتی از specifications
    const guarantee = product.specifications?.warranty || product.specifications?.guarantee || '';

    // ساخت URL کامل محصول
    const productUrl = `https://lent-shop.ir/product/${brand}/${productId}`;
    
    // آماده‌سازی توضیحات محصول
    const productDescription = product.description 
      ? product.description.replace(/"/g, '&quot;').replace(/\n/g, ' ').substring(0, 200)
      : `${product.name || ''} - خرید لنت ترمز ${product.brand || ''} با کیفیت عالی`;
    
    // ساخت متاتگ‌های کامل مورد نیاز ترب و SEO
    const torobMetaTags = `
    <!-- Torob Meta Tags -->
    <meta name="product_id" content="${product.id}">
    <meta name="product_name" content="${(product.name || '').replace(/"/g, '&quot;')}">
    <meta name="product_price" content="${productPrice}">
    <meta name="product_old_price" content="${productOldPrice}">
    <meta name="availability" content="${stockStatus}">
    ${guarantee ? `<meta name="guarantee" content="${guarantee.replace(/"/g, '&quot;')}">` : ''}
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${(product.name || '').replace(/"/g, '&quot;')} | ${(product.brand || '').replace(/"/g, '&quot;')} | لنت شاپ">
    <meta property="og:description" content="${productDescription}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="${productUrl}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:site_name" content="لنت شاپ">
    
    <!-- SEO Meta Tags -->
    <title>${(product.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} | ${(product.brand || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} | لنت شاپ</title>
    <meta name="description" content="${productDescription}">
    <meta name="keywords" content="لنت ${(product.brand || '').replace(/"/g, '&quot;')}, ${(product.name || '').replace(/"/g, '&quot;')}, لنت ترمز ${(product.brand || '').replace(/"/g, '&quot;')}, ${(product.category || '').replace(/"/g, '&quot;')}, لنت شاپ">
    <link rel="canonical" href="${productUrl}">
    `;

    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:189',message:'Meta tags created',data:{productId:product.id,productName:product.name,productPrice,productOldPrice,stockStatus,hasGuarantee:!!guarantee,metaTagsLength:torobMetaTags.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    // اضافه کردن متاتگ‌ها به head
    const beforeReplace = html.includes('</head>');
    html = html.replace('</head>', `${torobMetaTags}</head>`);
    const afterReplace = html.includes('product_id');
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:202',message:'Meta tags injection result',data:{beforeReplace,afterReplace,htmlLength:html.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    // تنظیم Content-Type
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:206',message:'Sending response',data:{htmlLength:html.length,hasMetaTags:html.includes('product_id')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    res.send(html);
  } catch (error) {
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:207',message:'Route error caught',data:{errorMessage:error.message,errorStack:error.stack,productId:req.params.productId,brand:req.params.brand},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    console.error('[Product HTML Route] Error:', error);
    // در صورت خطا، به frontend redirect کن
    const frontendUrl = CLIENT_ORIGIN 
      ? CLIENT_ORIGIN.split(',')[0].trim() 
      : 'https://lent-shop.ir';
    const { productId, brand } = req.params;
    res.redirect(`${frontendUrl}/product/${brand}/${productId}`);
  }
});

// Route برای محصول بدون brand
app.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // دریافت اطلاعات محصول از دیتابیس
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      // اگر محصول پیدا نشد، به frontend redirect کن
      const frontendUrl = CLIENT_ORIGIN 
        ? CLIENT_ORIGIN.split(',')[0].trim() 
        : 'https://lent-shop.ir';
      return res.redirect(`${frontendUrl}/product/${productId}`);
    }

    // استفاده از brand محصول برای redirect
    const brandSlug = product.brand ? product.brand.toLowerCase().replace(/\s+/g, '-') : 'product';
    return res.redirect(`/product/${brandSlug}/${productId}`);
  } catch (error) {
    console.error('[Product HTML Route] Error:', error);
    // در صورت خطا، به frontend redirect کن
    const frontendUrl = CLIENT_ORIGIN 
      ? CLIENT_ORIGIN.split(',')[0].trim() 
      : 'https://lent-shop.ir';
    const { productId } = req.params;
    res.redirect(`${frontendUrl}/product/${productId}`);
  }
});

// ⭐ Route برای صفحه لیست محصولات بدون جاوااسکریپت (برای ترب)
// این صفحه همه محصولات را به ترتیب جدیدترین نمایش می‌دهد
// استفاده از /api/ برای اطمینان از کار کردن route
// ⭐ Route برای تست مستقیم صفحات محصول (بدون نیاز به IIS rule)
// این route برای تست و دیباگ است - دسترسی مستقیم از طریق /api/product/:brand/:productId/html
app.get('/api/product/:brand/:productId/html', async (req, res) => {
  // #region agent log
  try {
    const logPath = join(__dirname, '..', '.cursor', 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:347',message:'API product route hit',data:{productId:req.params.productId,brand:req.params.brand,userAgent:req.headers['user-agent'],url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {}
  // #endregion
  
  // استفاده از همان منطق route اصلی
  try {
    const { productId, brand } = req.params;
    
    // دریافت اطلاعات محصول از دیتابیس
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:363',message:'API route - Database query result',data:{productId,hasProduct:!!product,hasError:!!error,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    if (error || !product) {
      // اگر محصول پیدا نشد، HTML با خطا برگردان (نه JSON)
      const errorHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>محصول یافت نشد - لنت شاپ</title>
</head>
<body>
  <h1>محصول یافت نشد</h1>
  <p>محصول با شناسه ${productId} و برند ${brand} یافت نشد.</p>
</body>
</html>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(errorHtml);
    }

    // خواندن فایل index.html
    const indexPath = join(__dirname, '..', 'dist', 'index.html');
    let html = '';
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:376',message:'API route - Checking index.html',data:{indexPath,indexExists:existsSync(indexPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    
    if (existsSync(indexPath)) {
      html = readFileSync(indexPath, 'utf-8');
    } else {
      const fallbackPath = join(__dirname, '..', 'index.html');
      if (existsSync(fallbackPath)) {
        html = readFileSync(fallbackPath, 'utf-8');
      } else {
        return res.status(404).send('HTML file not found');
      }
    }

    // تبدیل قیمت‌ها به عدد
    const cleanPrice = (price) => {
      if (!price) return '0';
      return price.toString().replace(/[^\d]/g, '');
    };

    const productPrice = cleanPrice(product.price || '0');
    const productOldPrice = cleanPrice(product.originalPrice || product.price || '0');
    
    // تعیین وضعیت موجودی
    const stockStatus = product.stockStatus === 'موجود' || (product.stockCount && product.stockCount > 0) 
      ? 'instock' 
      : 'outofstock';
    
    // دریافت URL کامل تصویر محصول
    const imageUrl = product.image 
      ? (product.image.startsWith('http') ? product.image : `https://lent-shop.ir${product.image}`)
      : 'https://lent-shop.ir/favicon.svg';
    
    // دریافت گارانتی
    const guarantee = product.specifications?.warranty || product.specifications?.guarantee || '';

    // ساخت URL کامل محصول
    const productUrl = `https://lent-shop.ir/product/${brand}/${productId}`;
    
    // آماده‌سازی توضیحات محصول
    const productDescription = product.description 
      ? product.description.replace(/"/g, '&quot;').replace(/\n/g, ' ').substring(0, 200)
      : `${product.name || ''} - خرید لنت ترمز ${product.brand || ''} با کیفیت عالی`;
    
    // ساخت متاتگ‌های کامل مورد نیاز ترب و SEO
    const torobMetaTags = `
    <!-- Torob Meta Tags -->
    <meta name="product_id" content="${product.id}">
    <meta name="product_name" content="${(product.name || '').replace(/"/g, '&quot;')}">
    <meta name="product_price" content="${productPrice}">
    <meta name="product_old_price" content="${productOldPrice}">
    <meta name="availability" content="${stockStatus}">
    ${guarantee ? `<meta name="guarantee" content="${guarantee.replace(/"/g, '&quot;')}">` : ''}
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${(product.name || '').replace(/"/g, '&quot;')} | ${(product.brand || '').replace(/"/g, '&quot;')} | لنت شاپ">
    <meta property="og:description" content="${productDescription}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="${productUrl}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:site_name" content="لنت شاپ">
    
    <!-- SEO Meta Tags -->
    <title>${(product.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} | ${(product.brand || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} | لنت شاپ</title>
    <meta name="description" content="${productDescription}">
    <meta name="keywords" content="لنت ${(product.brand || '').replace(/"/g, '&quot;')}, ${(product.name || '').replace(/"/g, '&quot;')}, لنت ترمز ${(product.brand || '').replace(/"/g, '&quot;')}, ${(product.category || '').replace(/"/g, '&quot;')}, لنت شاپ">
    <link rel="canonical" href="${productUrl}">
    `;

    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:413',message:'API route - Meta tags created',data:{productId:product.id,productName:product.name,productPrice,productOldPrice,stockStatus,hasGuarantee:!!guarantee,metaTagsLength:torobMetaTags.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    // اضافه کردن متاتگ‌ها به head
    const beforeReplace = html.includes('</head>');
    html = html.replace('</head>', `${torobMetaTags}</head>`);
    const afterReplace = html.includes('product_id');
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:420',message:'API route - Meta tags injection result',data:{beforeReplace,afterReplace,htmlLength:html.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    // تنظیم Content-Type
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:428',message:'API route - Sending response',data:{htmlLength:html.length,hasMetaTags:html.includes('product_id')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    res.send(html);
  } catch (error) {
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:432',message:'API route - Error caught',data:{errorMessage:error.message,errorStack:error.stack,productId:req.params.productId,brand:req.params.brand},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    console.error('[API Product HTML Route] Error:', error);
    // در صورت خطا، HTML با خطا برگردان (نه JSON)
    const errorHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خطا در بارگذاری - لنت شاپ</title>
</head>
<body>
  <h1>خطا در بارگذاری صفحه</h1>
  <p>متأسفانه خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید.</p>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(errorHtml);
  }
});

// ⭐ Route ساده‌تر برای تست - بدون /html (مستقیماً HTML برمی‌گرداند)
app.get('/api/product/:brand/:productId', async (req, res) => {
  console.log('[DEBUG] ⭐ /api/product/:brand/:productId route HIT!', { brand: req.params.brand, productId: req.params.productId, url: req.url });
  // #region agent log
  try {
    const logDir = join(__dirname, '..', '.cursor');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    const logPath = join(logDir, 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:556',message:'Simple API product route hit',data:{productId:req.params.productId,brand:req.params.brand,userAgent:req.headers['user-agent'],url:req.url,path:req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {
    console.error('[DEBUG] Log write error:', e);
  }
  // #endregion
  
  try {
    const { productId, brand } = req.params;
    
    // دریافت اطلاعات محصول از دیتابیس
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:450',message:'Simple route - Database query result',data:{productId,hasProduct:!!product,hasError:!!error,errorMessage:error?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    if (error || !product) {
      // اگر محصول پیدا نشد، HTML با خطا برگردان (نه JSON)
      const errorHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>محصول یافت نشد - لنت شاپ</title>
</head>
<body>
  <h1>محصول یافت نشد</h1>
  <p>محصول با شناسه ${productId} و برند ${brand} یافت نشد.</p>
</body>
</html>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(errorHtml);
    }

    // خواندن فایل index.html
    const indexPath = join(__dirname, '..', 'dist', 'index.html');
    let html = '';
    
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:463',message:'Simple route - Checking index.html',data:{indexPath,indexExists:existsSync(indexPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    
    if (existsSync(indexPath)) {
      html = readFileSync(indexPath, 'utf-8');
    } else {
      const fallbackPath = join(__dirname, '..', 'index.html');
      if (existsSync(fallbackPath)) {
        html = readFileSync(fallbackPath, 'utf-8');
      } else {
        return res.status(404).send('HTML file not found');
      }
    }

    // تبدیل قیمت‌ها به عدد
    const cleanPrice = (price) => {
      if (!price) return '0';
      return price.toString().replace(/[^\d]/g, '');
    };

    const productPrice = cleanPrice(product.price || '0');
    const productOldPrice = cleanPrice(product.originalPrice || product.price || '0');
    
    // تعیین وضعیت موجودی
    const stockStatus = product.stockStatus === 'موجود' || (product.stockCount && product.stockCount > 0) 
      ? 'instock' 
      : 'outofstock';
    
    // دریافت URL کامل تصویر محصول
    const imageUrl = product.image 
      ? (product.image.startsWith('http') ? product.image : `https://lent-shop.ir${product.image}`)
      : 'https://lent-shop.ir/favicon.svg';
    
    // دریافت گارانتی
    const guarantee = product.specifications?.warranty || product.specifications?.guarantee || '';

    // ساخت URL کامل محصول
    const productUrl = `https://lent-shop.ir/product/${brand}/${productId}`;
    
    // آماده‌سازی توضیحات محصول
    const productDescription = product.description 
      ? product.description.replace(/"/g, '&quot;').replace(/\n/g, ' ').substring(0, 200)
      : `${product.name || ''} - خرید لنت ترمز ${product.brand || ''} با کیفیت عالی`;
    
    // ساخت متاتگ‌های کامل مورد نیاز ترب و SEO
    const torobMetaTags = `
    <!-- Torob Meta Tags -->
    <meta name="product_id" content="${product.id}">
    <meta name="product_name" content="${(product.name || '').replace(/"/g, '&quot;')}">
    <meta name="product_price" content="${productPrice}">
    <meta name="product_old_price" content="${productOldPrice}">
    <meta name="availability" content="${stockStatus}">
    ${guarantee ? `<meta name="guarantee" content="${guarantee.replace(/"/g, '&quot;')}">` : ''}
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${(product.name || '').replace(/"/g, '&quot;')} | ${(product.brand || '').replace(/"/g, '&quot;')} | لنت شاپ">
    <meta property="og:description" content="${productDescription}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="${productUrl}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:locale" content="fa_IR">
    <meta property="og:site_name" content="لنت شاپ">
    
    <!-- SEO Meta Tags -->
    <title>${(product.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} | ${(product.brand || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} | لنت شاپ</title>
    <meta name="description" content="${productDescription}">
    <meta name="keywords" content="لنت ${(product.brand || '').replace(/"/g, '&quot;')}, ${(product.name || '').replace(/"/g, '&quot;')}, لنت ترمز ${(product.brand || '').replace(/"/g, '&quot;')}, ${(product.category || '').replace(/"/g, '&quot;')}, لنت شاپ">
    <link rel="canonical" href="${productUrl}">
    `;

    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:500',message:'Simple route - Meta tags created',data:{productId:product.id,productName:product.name,productPrice,productOldPrice,stockStatus,hasGuarantee:!!guarantee,metaTagsLength:torobMetaTags.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion

    // اضافه کردن متاتگ‌ها به head
    const beforeReplace = html.includes('</head>');
    const headTagCount = (html.match(/<\/head>/g) || []).length;
    console.log('[DEBUG] Before replace:', { hasHeadTag: beforeReplace, headTagCount, htmlLength: html.length });
    
    if (!beforeReplace) {
      console.error('[DEBUG] ERROR: </head> tag not found in HTML!');
      console.error('[DEBUG] HTML preview (first 1000 chars):', html.substring(0, 1000));
      // #region agent log
      try {
        const logDir = join(__dirname, '..', '.cursor');
        if (!existsSync(logDir)) {
          mkdirSync(logDir, { recursive: true });
        }
        const logPath = join(logDir, 'debug.log');
        const logData = JSON.stringify({location:'server/index.js:658',message:'ERROR - head tag not found',data:{htmlLength:html.length,htmlPreview:html.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
        appendFileSync(logPath, logData, 'utf8');
      } catch (e) {
        console.error('[DEBUG] Log write error:', e);
      }
      // #endregion
      // حتی اگر head tag نیست، سعی می‌کنیم متاتگ‌ها را اضافه کنیم
      html = `<head>${torobMetaTags}</head>` + html;
      console.log('[DEBUG] Added meta tags at beginning (no head tag found)');
    } else {
      const originalHtml = html;
      html = html.replace('</head>', `${torobMetaTags}</head>`);
      console.log('[DEBUG] Replaced </head> with meta tags', { 
        originalLength: originalHtml.length, 
        newLength: html.length,
        wasReplaced: originalHtml !== html 
      });
    }
    
    const afterReplace = html.includes('product_id');
    const metaTagInHtml = html.includes('<meta name="product_id"');
    console.log('[DEBUG] After replace:', { afterReplace, metaTagInHtml, htmlLength: html.length, metaTagsLength: torobMetaTags.length });
    
    // #region agent log
    try {
      const logDir = join(__dirname, '..', '.cursor');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
      const logPath = join(logDir, 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:675',message:'Simple route - Meta tags injection result',data:{beforeReplace,afterReplace,metaTagInHtml,headTagCount,htmlLength:html.length,metaTagsLength:torobMetaTags.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {
      console.error('[DEBUG] Log write error:', e);
    }
    // #endregion

    // تنظیم Content-Type و هدرهای تشخیصی
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-SSR', 'EXPRESS-HIT');
    res.setHeader('Cache-Control', 'public, max-age=300');
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:518',message:'Simple route - Sending response',data:{htmlLength:html.length,hasMetaTags:html.includes('product_id')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    res.send(html);
  } catch (error) {
    // #region agent log
    try {
      const logPath = join(__dirname, '..', '.cursor', 'debug.log');
      const logData = JSON.stringify({location:'server/index.js:523',message:'Simple route - Error caught',data:{errorMessage:error.message,errorStack:error.stack,productId:req.params.productId,brand:req.params.brand},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'}) + '\n';
      appendFileSync(logPath, logData, 'utf8');
    } catch (e) {}
    // #endregion
    console.error('[Simple API Product Route] Error:', error);
    // در صورت خطا، HTML با خطا برگردان (نه JSON)
    const errorHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خطا در بارگذاری - لنت شاپ</title>
</head>
<body>
  <h1>خطا در بارگذاری صفحه</h1>
  <p>متأسفانه خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید.</p>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(errorHtml);
  }
});

app.get('/api/torob-products', async (req, res) => {
  try {
    // دریافت همه محصولات به ترتیب جدیدترین
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, originalPrice, image, brand, stockStatus, stockCount, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Torob Products List] Error fetching products:', error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>خطا در دریافت محصولات - Lent Shop</title>
        </head>
        <body>
          <h1>خطا در دریافت محصولات</h1>
          <p>لطفاً بعداً دوباره تلاش کنید.</p>
        </body>
        </html>
      `);
    }

    const baseUrl = 'https://lent-shop.ir';
    
    // ساخت HTML ساده بدون جاوااسکریپت
    let html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لیست محصولات - Lent Shop</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .product-card {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .product-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      min-height: 50px;
    }
    .product-price {
      font-size: 18px;
      color: #e74c3c;
      font-weight: bold;
      margin: 10px 0;
    }
    .product-old-price {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
      margin-bottom: 5px;
    }
    .product-link {
      display: inline-block;
      margin-top: 10px;
      padding: 8px 16px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .product-link:hover {
      background-color: #2980b9;
    }
    .stock-status {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 5px;
    }
    .in-stock {
      background-color: #2ecc71;
      color: white;
    }
    .out-of-stock {
      background-color: #e74c3c;
      color: white;
    }
  </style>
</head>
<body>
  <h1>لیست محصولات - Lent Shop</h1>
  <div class="products-grid">
`;

    // اضافه کردن هر محصول به HTML
    if (products && products.length > 0) {
      products.forEach(product => {
        const brandSlug = product.brand ? product.brand.toLowerCase().replace(/\s+/g, '-') : 'product';
        const productUrl = `${baseUrl}/product/${brandSlug}/${product.id}`;
        const imageUrl = product.image 
          ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
          : `${baseUrl}/favicon.svg`;
        
        // تبدیل قیمت برای نمایش
        const price = product.price || '0';
        const oldPrice = product.originalPrice || null;
        
        // تعیین وضعیت موجودی
        const isInStock = product.stockStatus === 'موجود' || (product.stockCount && product.stockCount > 0);
        const stockClass = isInStock ? 'in-stock' : 'out-of-stock';
        const stockText = isInStock ? 'موجود' : 'ناموجود';
        
        html += `
    <div class="product-card">
      <img src="${imageUrl}" alt="${(product.name || '').replace(/"/g, '&quot;')}" class="product-image" onerror="this.src='${baseUrl}/favicon.svg'">
      <div class="product-name">${(product.name || 'بدون نام').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      ${oldPrice ? `<div class="product-old-price">${oldPrice} تومان</div>` : ''}
      <div class="product-price">${price} تومان</div>
      <div class="stock-status ${stockClass}">${stockText}</div>
      <a href="${productUrl}" class="product-link">مشاهده محصول</a>
    </div>
`;
      });
    } else {
      html += `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
      <p>هیچ محصولی یافت نشد.</p>
    </div>
`;
    }

    html += `
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('[Torob Products List] Error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>خطا - Lent Shop</title>
      </head>
      <body>
        <h1>خطا در بارگذاری صفحه</h1>
        <p>لطفاً بعداً دوباره تلاش کنید.</p>
      </body>
      </html>
    `);
  }
});

// ⭐ Route برای sitemap.xml داینامیک
// استفاده از /api/ برای اطمینان از کار کردن route
app.get('/api/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://lent-shop.ir';
    
    // دریافت همه محصولات
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, brand, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Sitemap] Error fetching products:', error);
      // در صورت خطا، sitemap استاتیک را برگردان
      return res.redirect('/sitemap-static.xml');
    }

    // شروع ساخت sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Categories Page -->
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Vehicle Categories -->
  <url>
    <loc>${baseUrl}/vehicle</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/suv</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/pickup</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Special Offers -->
  <url>
    <loc>${baseUrl}/specials</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Product Pages -->
`;

    // اضافه کردن صفحات محصول
    if (products && products.length > 0) {
      products.forEach(product => {
        const brandSlug = product.brand ? product.brand.toLowerCase().replace(/\s+/g, '-') : 'product';
        const productUrl = `${baseUrl}/product/${brandSlug}/${product.id}`;
        const lastmod = product.updated_at 
          ? new Date(product.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        
        sitemap += `  <url>
    <loc>${productUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
    }

    sitemap += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemap);
  } catch (error) {
    console.error('[Sitemap] Error:', error);
    // در صورت خطا، sitemap استاتیک را برگردان
    res.redirect('/sitemap-static.xml');
  }
});

// Route تست برای بررسی schema
app.get('/test-schema', async (_req, res) => {
  try {
    // تست query ساده برای بررسی وجود ستون‌ها
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('id, payment_authority, payment_ref_id, order_number')
      .limit(1);
    
    if (error) {
      return res.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Schema OK - Columns exist',
      sampleData: data 
    });
  } catch (err) {
    res.json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    });
  }
});

// Payment callback route - باید قبل از /api/payment باشد
app.get('/payment/callback', async (req, res) => {
  // 🚨🚨🚨 لاگ طلایی: اگر این لاگ را دیدید، یعنی callback به سرور رسیده است
  console.log('🚨🚨🚨 CALLBACK HIT - ROUTE EXECUTED 🚨🚨🚨');
  console.log('[Payment Callback] 🚨 CALLBACK HIT', {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'referer': req.headers['referer'],
      'x-forwarded-for': req.headers['x-forwarded-for']
    }
  });
  
  let orderId = null;
  
  try {
    // Trim کردن Authority برای اطمینان از عدم وجود فضاهای اضافی
    const Authority = req.query.Authority ? String(req.query.Authority).trim() : null;
    const Status = req.query.Status ? String(req.query.Status).trim() : null;
    
    console.log('[Payment Callback] دریافت callback:', { Authority, Status });
    
    // اگر Status غیر OK است، پرداخت لغو شده
    if (Status !== 'OK') {
      console.log('[Payment Callback] ⚠️ Status غیر OK است، پرداخت لغو شده:', Status);
      
      // اگر Authority داریم، وضعیت را به failed تغییر بده
      if (Authority) {
        try {
          // استفاده از query که فقط id را برمی‌گرداند (بدون payment_authority در select)
          const { data: order, error: findError } = await supabaseAdmin
            .from('orders')
            .select('id')
            .eq('payment_authority', Authority)
            .limit(1)
            .maybeSingle();
          
          if (findError) {
            console.error('[Payment Callback] ⚠️ خطا در پیدا کردن سفارش:', findError);
            // اگر خطای schema است، سعی کن با query دیگر
            if (findError.code === '42703' || findError.message?.includes('does not exist')) {
              console.warn('[Payment Callback] ⚠️ ستون payment_authority وجود ندارد، از query جایگزین استفاده می‌کنیم');
              // Query جایگزین: پیدا کردن بر اساس id (اگر authority در metadata ذخیره شده)
              // یا skip کردن این بخش
            }
          } else if (order) {
            await supabaseAdmin
              .from('orders')
              .update({
                payment_status: 'failed',
                payment_verified_at: new Date().toISOString(),
              })
              .eq('id', order.id);
            console.log('[Payment Callback] ✅ وضعیت سفارش به failed تغییر یافت (orderId:', order.id, ')');
            orderId = order.id;
          }
        } catch (updateError) {
          console.error('[Payment Callback] ⚠️ خطا در به‌روزرسانی وضعیت به failed:', updateError);
        }
      }
      
      // Redirect به frontend
      const frontendUrl = CLIENT_ORIGIN 
        ? CLIENT_ORIGIN.split(',')[0].trim() 
        : 'https://lent-shop.ir';
      const queryParams = new URLSearchParams(req.query);
      if (orderId) {
        queryParams.set('orderId', orderId);
      }
      return res.redirect(`${frontendUrl}/payment/callback?${queryParams.toString()}`);
    }
    
    // اگر Status=OK است، باید verify کنیم
    if (!Authority) {
      console.error('[Payment Callback] ⚠️ Authority موجود نیست');
      const frontendUrl = CLIENT_ORIGIN 
        ? CLIENT_ORIGIN.split(',')[0].trim() 
        : 'https://lent-shop.ir';
      return res.redirect(`${frontendUrl}/payment/callback?${new URLSearchParams(req.query).toString()}`);
    }
    
    // دریافت اطلاعات سفارش بر اساس authority
    try {
      let order = null;
      let orderError = null;
      
      // ⭐ راه‌حل قطعی: استفاده از query ساده که فقط ستون‌های موجود را می‌خواند
      // ابتدا فقط id را بگیریم (بدون payment_authority در select)
      const { data: orderFound, error: findError } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('payment_authority', Authority)
        .limit(1)
        .maybeSingle();
      
      if (findError) {
        // اگر خطای schema است (ستون وجود ندارد)
        if (findError.code === '42703' || findError.message?.includes('does not exist')) {
          console.error('[Payment Callback] ⚠️ خطای Schema - ستون payment_authority وجود ندارد:', findError);
          console.error('[Payment Callback] ⚠️ لطفاً migration را اجرا کنید و PM2 را restart کنید');
          orderError = findError;
        } else {
          orderError = findError;
        }
      } else if (orderFound && orderFound.id) {
        // اگر order پیدا شد، اطلاعات کامل را بگیر (با id)
        const { data: orderFull, error: fullError } = await supabaseAdmin
          .from('orders')
          .select('id, total_amount, payment_status, order_number')
          .eq('id', orderFound.id)
          .single();
        
        if (fullError) {
          orderError = fullError;
        } else if (orderFull) {
          // اضافه کردن payment_authority به صورت دستی (اگر در select نبود)
          order = {
            ...orderFull,
            payment_authority: Authority, // می‌دانیم که این authority مربوط به این order است
          };
        }
      }

      if (orderError || !order || !order.total_amount) {
        console.error('[Payment Callback] ⚠️ سفارش یافت نشد یا total_amount ندارد:', {
          orderError: orderError ? {
            message: orderError.message,
            code: orderError.code,
            details: orderError.details,
            hint: orderError.hint
          } : null,
          hasOrder: !!order,
          hasTotalAmount: order?.total_amount ? true : false,
          authority: Authority
        });
        const frontendUrl = CLIENT_ORIGIN 
          ? CLIENT_ORIGIN.split(',')[0].trim() 
          : 'https://lent-shop.ir';
        return res.redirect(`${frontendUrl}/payment/callback?${new URLSearchParams(req.query).toString()}`);
      }

      orderId = order.id;
      
      // ⭐ تبدیل مبلغ از تومان به ریال (دقیقاً همان محاسبه‌ای که در create payment انجام شد)
      // total_amount در دیتابیس به تومان ذخیره شده است
      const amountInRials = (order.total_amount || 0) * 10;
      
      console.log('[Payment Callback] در حال تایید پرداخت:', {
        orderId: order.id,
        authority: Authority,
        amountInRials,
        totalAmount: order.total_amount,
        note: 'total_amount به تومان است، amountInRials به ریال'
      });
      
      // ⭐ ابتدا verify می‌کنیم، سپس بر اساس نتیجه وضعیت را تغییر می‌دهیم
      try {
        const verifyResult = await verifyPayment({ 
          authority: Authority, 
          amount: amountInRials 
        });

        if (verifyResult.success) {
          // ✅ Verify موفق بود - وضعیت را به paid تغییر بده
          console.log('[Payment Callback] ✅ Verify موفق بود، وضعیت را به paid تغییر می‌دهیم');
          console.log('[Payment Callback] 📋 Verify Result:', {
            success: verifyResult.success,
            refId: verifyResult.refId,
            code: verifyResult.code,
            cardHash: verifyResult.cardHash,
            fee: verifyResult.fee
          });
          
          const updateData = {
            payment_status: 'confirmed',
            payment_verified_at: new Date().toISOString(),
          };
          
          // اگر refId موجود است، اضافه کن
          if (verifyResult.refId) {
            updateData.payment_ref_id = String(verifyResult.refId); // تبدیل به string برای اطمینان
            console.log('[Payment Callback] 💾 در حال ذخیره payment_ref_id:', verifyResult.refId);
          } else {
            console.warn('[Payment Callback] ⚠️ verifyResult.refId موجود نیست!', verifyResult);
          }
          
          const updateResult = await supabaseAdmin
            .from('orders')
            .update(updateData)
            .eq('id', order.id);
          
          if (updateResult.error) {
            console.error('[Payment Callback] ⚠️ خطا در به‌روزرسانی وضعیت به paid:', updateResult.error);
          } else {
            console.log('[Payment Callback] ✅ وضعیت سفارش به paid تغییر یافت:', {
              orderId: order.id,
              authority: Authority,
              refId: verifyResult.refId,
              updateData: updateData
            });
            
            // بررسی نهایی: آیا refId واقعاً ذخیره شد؟
            const { data: verifyOrder } = await supabaseAdmin
              .from('orders')
              .select('payment_ref_id')
              .eq('id', order.id)
              .single();
            
            console.log('[Payment Callback] 🔍 بررسی نهایی payment_ref_id در دیتابیس:', verifyOrder?.payment_ref_id);
            
            // ارسال پیامک تایید خرید (فقط اگر فعال باشد)
            const ENABLE_ORDER_SMS = process.env.ENABLE_ORDER_CONFIRMATION_SMS !== 'false'; // پیش‌فرض: فعال
            
            // 🚨 لاگ مهم: بررسی اینکه آیا به این بخش رسیدیم
            console.log('[Payment Callback] 🚨🚨🚨 CALLBACK SUCCESS REACHED - SMS SECTION 🚨🚨🚨');
            console.log('[Payment Callback] 📱 بررسی ارسال پیامک تایید خرید');
            console.log('[Payment Callback] ENABLE_ORDER_CONFIRMATION_SMS:', process.env.ENABLE_ORDER_CONFIRMATION_SMS);
            console.log('[Payment Callback] ENABLE_ORDER_SMS (computed):', ENABLE_ORDER_SMS);
            console.log('[Payment Callback] FARAZ_SMS_ORDER_PATTERN_CODE:', process.env.FARAZ_SMS_ORDER_PATTERN_CODE ? 'SET' : 'NOT SET');
            
            if (ENABLE_ORDER_SMS) {
              try {
                console.log('[Payment Callback] 🔍 دریافت اطلاعات سفارش برای پیامک...');
                // دریافت اطلاعات کامل سفارش برای پیامک
                const { data: orderFull, error: orderFullError } = await supabaseAdmin
                  .from('orders')
                  .select('id, phone, total_amount, payment_ref_id, order_number, full_name')
                  .eq('id', order.id)
                  .single();
                
                console.log('[Payment Callback] 📦 اطلاعات سفارش:', {
                  id: orderFull?.id,
                  phone: orderFull?.phone ? `${orderFull.phone.substring(0, 4)}***` : 'NOT SET',
                  phoneRaw: orderFull?.phone, // برای دیباگ
                  phoneType: typeof orderFull?.phone,
                  phoneLength: orderFull?.phone?.length,
                  order_number: orderFull?.order_number,
                  total_amount: orderFull?.total_amount,
                  payment_ref_id: orderFull?.payment_ref_id,
                  error: orderFullError?.message,
                  orderFullKeys: orderFull ? Object.keys(orderFull) : null
                });
                
                // بررسی دقیق‌تر phone
                const phoneValue = orderFull?.phone;
                const hasValidPhone = phoneValue && typeof phoneValue === 'string' && phoneValue.trim().length > 0;
                
                console.log('[Payment Callback] 🔍 بررسی phone:', {
                  phoneValue: phoneValue,
                  phoneType: typeof phoneValue,
                  phoneLength: phoneValue?.length,
                  phoneTrimmed: phoneValue?.trim(),
                  hasValidPhone: hasValidPhone
                });
                
                if (!orderFullError && orderFull && hasValidPhone) {
                  // آماده‌سازی اطلاعات سفارش برای Pattern
                  const orderData = {
                    orderNumber: orderFull.order_number || orderFull.id,
                    trackingCode: orderFull.payment_ref_id || 'نامشخص',
                    amount: orderFull.total_amount || 0
                  };
                  
                  console.log('[Payment Callback] 📤 آماده‌سازی داده‌های سفارش برای Pattern:', {
                    orderNumber: orderData.orderNumber,
                    trackingCode: orderData.trackingCode,
                    amount: orderData.amount
                  });
                  
                  // ارسال پیامک با Pattern
                  console.log('[Payment Callback] 📨 در حال ارسال پیامک...');
                  console.log('[Payment Callback] 📞 شماره تلفن برای ارسال:', phoneValue);
                  const smsResult = await sendOrderConfirmationSms(phoneValue.trim(), orderData);
                  
                  console.log('[Payment Callback] 📬 نتیجه ارسال پیامک:', {
                    success: smsResult.success,
                    error: smsResult.error,
                    messageId: smsResult.messageId
                  });
                  
                  if (smsResult.success) {
                    console.log('[Payment Callback] ✅ پیامک تایید خرید با موفقیت ارسال شد');
                  } else {
                    console.error('[Payment Callback] ⚠️ خطا در ارسال پیامک تایید خرید:', smsResult.error);
                    console.error('[Payment Callback] ⚠️ جزئیات خطا:', JSON.stringify(smsResult, null, 2));
                    // خطا را لاگ می‌کنیم اما پرداخت را موفق می‌دانیم
                  }
                } else {
                  console.warn('[Payment Callback] ⚠️ نتوانستیم اطلاعات سفارش را برای ارسال پیامک دریافت کنیم');
                  console.warn('[Payment Callback] ⚠️ orderFullError:', orderFullError);
                  console.warn('[Payment Callback] ⚠️ orderFull:', orderFull ? 'EXISTS' : 'NULL');
                  console.warn('[Payment Callback] ⚠️ phone:', orderFull?.phone ? 'EXISTS' : 'MISSING');
                }
              } catch (smsError) {
                console.error('[Payment Callback] ⚠️ خطا در ارسال پیامک تایید خرید (Exception):', smsError);
                console.error('[Payment Callback] ⚠️ Stack trace:', smsError.stack);
                // خطا را لاگ می‌کنیم اما پرداخت را موفق می‌دانیم
              }
            } else {
              console.log('[Payment Callback] ℹ️ ارسال پیامک تایید خرید غیرفعال است (ENABLE_ORDER_CONFIRMATION_SMS=false)');
            }
          }
        } else {
          // ❌ Verify ناموفق بود - وضعیت را به failed تغییر بده
          console.warn('[Payment Callback] ❌ Verify ناموفق بود، وضعیت را به failed تغییر می‌دهیم:', verifyResult);
          
          const updateResult = await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'failed',
              payment_verified_at: new Date().toISOString(),
            })
            .eq('id', order.id);
          
          if (updateResult.error) {
            console.error('[Payment Callback] ⚠️ خطا در به‌روزرسانی وضعیت به failed:', updateResult.error);
          } else {
            console.log('[Payment Callback] ✅ وضعیت سفارش به failed تغییر یافت (orderId:', order.id, ')');
          }
        }
      } catch (verifyError) {
        // ❌ خطا در verify - وضعیت را به failed تغییر بده
        console.error('[Payment Callback] ❌ خطا در verify، وضعیت را به failed تغییر می‌دهیم:', verifyError);
        
        try {
          await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'failed',
              payment_verified_at: new Date().toISOString(),
            })
            .eq('id', order.id);
          console.log('[Payment Callback] ✅ وضعیت سفارش به failed تغییر یافت (orderId:', order.id, ')');
        } catch (updateError) {
          console.error('[Payment Callback] ⚠️ خطا در به‌روزرسانی وضعیت به failed:', updateError);
        }
      }
    } catch (dbError) {
      console.error('[Payment Callback] خطا در دریافت سفارش از دیتابیس:', dbError);
    }

    // Redirect به frontend با query parameters
    const frontendUrl = CLIENT_ORIGIN 
      ? CLIENT_ORIGIN.split(',')[0].trim() 
      : 'https://lent-shop.ir';
    
    // ساخت query parameters
    const queryParams = new URLSearchParams(req.query);
    
    // اگر orderId پیدا شد، اضافه کن
    if (orderId) {
      queryParams.set('orderId', orderId);
    }
    
    const redirectUrl = `${frontendUrl}/payment/callback?${queryParams.toString()}`;
    console.log('[Payment Callback] Redirect به:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('[Payment Callback] خطای کلی:', error);
    console.error('[Payment Callback] Stack:', error.stack);
    // در صورت خطا، باز هم به frontend redirect می‌کنیم
    const frontendUrl = CLIENT_ORIGIN 
      ? CLIENT_ORIGIN.split(',')[0].trim() 
      : 'https://lent-shop.ir';
    const queryString = new URLSearchParams(req.query).toString();
    res.redirect(`${frontendUrl}/payment/callback?${queryString}`);
  }
});

app.use('/api/otp', otpRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/sales', salesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'خطای داخلی سرور',
    details: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`OTP server listening on port ${PORT}`);
  // #region agent log
  try {
    const logPath = join(__dirname, '..', '.cursor', 'debug.log');
    const logData = JSON.stringify({location:'server/index.js:1025',message:'Server started',data:{port:PORT,nodeEnv:NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'}) + '\n';
    appendFileSync(logPath, logData, 'utf8');
  } catch (e) {
    console.error('[Debug] Log write error on startup:', e);
  }
  // #endregion
  console.log('[DEBUG] Server started - routes registered');
  console.log('[DEBUG] Available routes: /api/test, /api/product/:brand/:productId, /api/product/:brand/:productId/html');
});

