// تابع فرمت کردن قیمت با جداکننده سه رقمی
export const formatPrice = (price) => {
  if (!price) return '0';
  
  // تبدیل به رشته و حذف کاراکترهای غیر عددی
  const cleanPrice = price.toString().replace(/[^\d]/g, '');
  
  if (cleanPrice === '') return '0';
  
  // تبدیل به عدد و فرمت کردن
  const numericPrice = parseInt(cleanPrice, 10);
  
  // فرمت کردن با جداکننده سه رقمی
  return numericPrice.toLocaleString('fa-IR');
};

// تابع فرمت کردن قیمت با واحد تومان
export const formatPriceWithUnit = (price) => {
  const formattedPrice = formatPrice(price);
  return `${formattedPrice} تومان`;
};

// تابع فرمت کردن قیمت با تخفیف
export const formatPriceWithDiscount = (originalPrice, discountedPrice) => {
  const formattedOriginal = formatPriceWithUnit(originalPrice);
  const formattedDiscounted = formatPriceWithUnit(discountedPrice);
  
  return {
    original: formattedOriginal,
    discounted: formattedDiscounted
  };
};
