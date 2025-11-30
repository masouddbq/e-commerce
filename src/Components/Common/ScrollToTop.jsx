import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// این کامپوننت باعث می‌شود با تغییر route، صفحه از بالاترین نقطه نمایش داده شود
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // اسکرول فوری به بالای صفحه بدون انیمیشن
    window.scrollTo(0, 0);
  }, [pathname]); // هر بار که pathname تغییر کند اجرا می‌شود

  return null;
};

export default ScrollToTop;

