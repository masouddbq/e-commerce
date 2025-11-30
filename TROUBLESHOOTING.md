# راهنمای عیب‌یابی مشکلات Vite

## مشکل: GET http://localhost:3000/src/App.jsx?t=1755705789723 net::ERR_ABORTED 500 (Internal Server Error)

### علل احتمالی:
1. **Vite Dev Server مشکل دارد**
2. **Port 3000 در حال استفاده است**
3. **Cache مشکل دارد**
4. **Dependencies مشکل دارند**

### راه حل‌ها:

#### 1. Restart Vite Dev Server
```bash
# در ترمینال:
# 1. Ctrl+C برای توقف سرور
# 2. دوباره اجرا کنید:
npm run dev
```

#### 2. تغییر Port
```bash
# اگر port 3000 مشکل دارد:
npm run dev -- --port 3001
# یا
yarn dev --port 3001
```

#### 3. پاک کردن Cache
```bash
# پاک کردن node_modules
rm -rf node_modules
rm package-lock.json
npm install

# پاک کردن Vite cache
rm -rf .vite
rm -rf dist
```

#### 4. بررسی Port Usage
```bash
# در Windows:
netstat -ano | findstr :3000

# در Mac/Linux:
lsof -i :3000
```

#### 5. Kill Process
```bash
# اگر process دیگری از port استفاده می‌کند:
# Windows:
taskkill /PID <PID> /F

# Mac/Linux:
kill -9 <PID>
```

## مشکل: Extension Errors

### خطاهای extension را نادیده بگیرید:
- `Unchecked runtime.lastError`
- `Could not establish connection`
- `Cannot find menu item with id translate-page`

این خطاها مربوط به extension های مرورگر هستند و ربطی به کد شما ندارند.

## مشکل: React 19 Compatibility

### React 19 تغییرات زیادی دارد:
1. **StrictMode**: ممکن است مشکلاتی ایجاد کند
2. **New Hooks**: ممکن است با کد قدیمی سازگار نباشد
3. **Compiler**: تغییرات در JSX compilation

### راه حل:
```bash
# Downgrade به React 18:
npm install react@^18.2.0 react-dom@^18.2.0

# یا upgrade dependencies:
npm update
```

## مشکل: Vite Configuration

### بررسی vite.config.js:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: false, // اجازه تغییر port
    cors: true // حل مشکلات CORS
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] // بهینه‌سازی dependencies
  }
})
```

## مشکل: Environment Variables

### ایجاد .env.local:
```bash
# در root پروژه:
VITE_DEV_SERVER_PORT=3000
VITE_DEV_SERVER_HOST=localhost
NODE_ENV=development
```

## مشکل: Browser Cache

### پاک کردن browser cache:
1. **Ctrl+Shift+Delete** (Windows)
2. **Cmd+Shift+Delete** (Mac)
3. **Hard Refresh**: Ctrl+F5 یا Cmd+Shift+R

## مشکل: Antivirus/Firewall

### بررسی:
1. **Antivirus**: ممکن است localhost را block کند
2. **Firewall**: ممکن است port 3000 را block کند
3. **Windows Defender**: ممکن است مشکل ایجاد کند

## مشکل: Node.js Version

### بررسی Node.js version:
```bash
node --version
# باید 18+ باشد

npm --version
# باید 9+ باشد
```

### Update Node.js:
```bash
# استفاده از nvm:
nvm install 18
nvm use 18

# یا دانلود مستقیم از nodejs.org
```

## مشکل: Package Manager

### استفاده از npm:
```bash
npm cache clean --force
npm install
```

### استفاده از yarn:
```bash
yarn cache clean
yarn install
```

### استفاده از pnpm:
```bash
pnpm store prune
pnpm install
```

## مشکل: Development Tools

### بررسی:
1. **VS Code**: update extensions
2. **DevTools**: clear cache
3. **Browser**: update to latest version

## مشکل: Network

### بررسی:
1. **localhost**: 127.0.0.1:3000
2. **Proxy**: اگر از proxy استفاده می‌کنید
3. **VPN**: ممکن است مشکل ایجاد کند

## مشکل: File Permissions

### بررسی permissions:
```bash
# در Mac/Linux:
chmod -R 755 .
chmod -R 644 src/**/*.jsx
```

## مشکل: Import/Export

### بررسی:
1. **File extensions**: .jsx vs .js
2. **Import paths**: relative vs absolute
3. **Export syntax**: default vs named

## مشکل: Build

### تست build:
```bash
npm run build
npm run preview
```

اگر build موفق باشد، مشکل در dev server است.

## مشکل: Dependencies

### بررسی conflicts:
```bash
npm ls
npm audit
npm outdated
```

## مشکل: TypeScript

### اگر از TypeScript استفاده می‌کنید:
```bash
npm install --save-dev typescript @types/node
npx tsc --init
```

## مشکل: ESLint

### بررسی ESLint:
```bash
npm run lint
# یا
npx eslint src/ --ext .js,.jsx
```

## مشکل: PostCSS/Tailwind

### بررسی:
```bash
npm install --save-dev postcss autoprefixer tailwindcss
npx tailwindcss init
```

## مشکل: Hot Reload

### غیرفعال کردن Hot Reload:
```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: false
  }
})
```

## مشکل: Source Maps

### غیرفعال کردن Source Maps:
```javascript
// vite.config.js
export default defineConfig({
  build: {
    sourcemap: false
  }
})
```

## مشکل: Console Errors

### بررسی console:
1. **Errors**: خطاهای قرمز
2. **Warnings**: هشدارهای زرد
3. **Info**: اطلاعات آبی

## مشکل: Network Tab

### بررسی Network tab:
1. **Failed requests**: درخواست‌های ناموفق
2. **Status codes**: کدهای وضعیت
3. **Response**: پاسخ‌های سرور

## مشکل: Performance

### بررسی Performance:
1. **Bundle size**: اندازه bundle
2. **Loading time**: زمان بارگذاری
3. **Memory usage**: استفاده از حافظه

## مشکل: Compatibility

### بررسی compatibility:
1. **Browser support**: پشتیبانی مرورگر
2. **Polyfills**: نیاز به polyfill
3. **Transpilation**: نیاز به transpile

## مشکل: Debug

### اضافه کردن debug:
```javascript
// در کد:
console.log('Debug info:', data);
debugger; // breakpoint
```

## مشکل: Error Boundary

### استفاده از Error Boundary:
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
}
```

## مشکل: Suspense

### استفاده از Suspense:
```javascript
<Suspense fallback={<div>Loading...</div>}>
  <Component />
</Suspense>
```

## مشکل: Lazy Loading

### استفاده از Lazy Loading:
```javascript
const Component = React.lazy(() => import('./Component'));
```

## مشکل: Code Splitting

### استفاده از Code Splitting:
```javascript
// در vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
```

## مشکل: Environment

### بررسی environment:
```bash
echo $NODE_ENV
echo $PORT
echo $HOST
```

## مشکل: Logs

### بررسی logs:
```bash
# در ترمینال:
npm run dev 2>&1 | tee dev.log
```

## مشکل: Alternative

### استفاده از alternative:
```bash
# استفاده از create-react-app:
npx create-react-app my-app

# یا استفاده از Next.js:
npx create-next-app@latest my-app
```

## مشکل: Support

### دریافت support:
1. **GitHub Issues**: برای Vite
2. **Stack Overflow**: برای React
3. **Discord**: برای community
4. **Documentation**: برای official docs

## نکات مهم:

1. **همیشه آخرین version را استفاده کنید**
2. **Cache را پاک کنید**
3. **Dependencies را update کنید**
4. **Console را بررسی کنید**
5. **Network tab را بررسی کنید**
6. **Error boundary استفاده کنید**
7. **Suspense استفاده کنید**
8. **Lazy loading استفاده کنید**
9. **Code splitting استفاده کنید**
10. **Performance را monitor کنید**
