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

// مدیریت تصاویر برندها - سیستم متمرکز
export const BRAND_IMAGES = {
  // برندهای اصلی - استفاده از تصاویر WEBP موجود
  'سایپا': '/WEBP/saipa.webp',
  'ایران خودرو': '/WEBP/irankhodro.webp',
  'پژو': '/WEBP/peugeot.webp',
  'هیوندای': '/WEBP/hyun.webp',
  'نیسان': '/WEBP/nissan.webp',
  'تویوتا': '/WEBP/toyota.webp',
  'لکسوس': '/WEBP/lexus.webp',
  'کیا': '/WEBP/kia.webp',
  'جیلی': '/WEBP/geely.webp',
  'مزدا': '/WEBP/mazda.webp',
  'میتسوبیشی': '/WEBP/mitsubishi.webp',
  'سوزوکی': '/WEBP/suzuki.webp',
  'رنو': '/WEBP/renault.webp',
  'فاو': '/WEBP/faw.webp',
  'فولکس واگن': '/WEBP/volkswagen.webp', // کنار فاو
  'ام جی': '/WEBP/mg.webp', // از سمت راست سوم
  
  // برندهای جدید
  'بی‌ام‌دبلیو': '/WEBP/bmw.webp',
  'BMW': '/WEBP/bmw.webp',
  'چانگان': '/WEBP/geely.webp',
  'آمیکو': '/WEBP/geely.webp',
  'برلیانس': '/WEBP/kia.webp',
  'بنز': '/WEBP/lexus.webp',
  'مرسدس': '/WEBP/lexus.webp',
  'مرسدس بنز': '/WEBP/lexus.webp',
  
  // برندهای اضافی که ممکن است در دیتابیس باشند
  'ام‌جی': '/WEBP/mg.webp',
  'فولکس‌واگن': '/WEBP/volkswagen.webp',
  'جی‌ای‌سی': '/WEBP/jac.webp',
  'جک': '/WEBP/jac.webp',
  'هوندا': '/WEBP/hyun.webp',
  'آئودی': '/WEBP/lexus.webp',
  'مازراتی': '/WEBP/lexus.webp',
  'فراری': '/WEBP/lexus.webp',
  'لامبورگینی': '/WEBP/lexus.webp',
  'پورشه': '/WEBP/lexus.webp',
  'آلفارومئو': '/WEBP/lexus.webp',
  // برندهای جدید اضافه شده
  'اس دبلیو ام': '/WEBP/geely.webp',
  'SWM': '/WEBP/geely.webp',
  'دانگ فنگ': '/WEBP/geely.webp',
  'Dongfeng': '/WEBP/geely.webp',
  'گک-گونو': '/WEBP/geely.webp',
  'گک گونو': '/WEBP/geely.webp',
  'Geek Gono': '/WEBP/geely.webp',
  'گک': '/WEBP/geely.webp',
  'Gono': '/WEBP/geely.webp',
  'گک-گونو مکث-موتور': '/WEBP/geely.webp',
  'Geek-Gono': '/WEBP/geely.webp',
  'Geek-Gono Motor': '/WEBP/geely.webp',
  'مکث-موتور': '/WEBP/geely.webp',
  'Mekth-Motor': '/WEBP/geely.webp',
  'مکث موتور': '/WEBP/geely.webp',
  'Mekth Motor': '/WEBP/geely.webp',
  // برندهای جدید اضافه شده
  'فردا موتورز': '/WEBP/geely.webp',
  'فردا موتور': '/WEBP/geely.webp',
  'Farda Motors': '/WEBP/geely.webp',
  'Farda Motor': '/WEBP/geely.webp',
  'گریت وال': '/WEBP/geely.webp',
  'گریتوال': '/WEBP/geely.webp',
  'Great Wall': '/WEBP/geely.webp',
  'GreatWall': '/WEBP/geely.webp'
};

// تابع برای دریافت تصویر برند
export const getBrandImage = (brandName) => {
  if (!brandName) return '/WEBP/geely.webp';
  
  // جستجوی دقیق
  if (BRAND_IMAGES[brandName]) {
    return BRAND_IMAGES[brandName];
  }
  
  // جستجوی partial برای برندهایی که ممکن است نام‌های مختلف داشته باشند
  const partialMatch = Object.keys(BRAND_IMAGES).find(key => 
    brandName.includes(key) || key.includes(brandName)
  );
  
  if (partialMatch) {
    console.log(`Partial match found for ${brandName}: ${partialMatch}`);
    return BRAND_IMAGES[partialMatch];
  }
  
  // تصویر پیش‌فرض - استفاده از تصویر موجود
  console.log(`No image found for brand: ${brandName}, using fallback`);
  return '/WEBP/geely.webp'; // استفاده از تصویر موجود به عنوان fallback
};

// تابع برای دریافت تصویر برند با fallback
export const getBrandImageWithFallback = (brandName, fallbackImage = '/WEBP/geely.webp') => {
  const image = getBrandImage(brandName);
  return image !== '/WEBP/geely.webp' ? image : fallbackImage;
};

// تابع برای دریافت نام فایل تصویر برند (برای سازگاری با کد قبلی)
export const getBrandImageName = (brandName) => {
  if (!brandName) return 'WEBP/geely.webp';
  
  const brandMap = {
    'تویوتا': 'toyota',
    'هیوندای': 'hyundai',
    'نیسان': 'nissan',
    'کیا': 'kia',
    'لکسوس': 'lexus',
    'جیلی': 'geely',
    'مزدا': 'mazda',
    'میتسوبیشی': 'mitsubishi',
    'سوزوکی': 'suzuki',
    'رنو': 'renault',
    'پژو': 'peugeot',
    'ایران خودرو': 'irankhodro',
    'فاو': 'faw',
    'سایپا': 'saipa',
    'ام جی': 'mg',
    'ام‌جی': 'mg',
    'فولکس واگن': 'volkswagen',
    'فولکس‌واگن': 'volkswagen',
    'جی‌ای‌سی': 'jac',
    'جک': 'jac',
    'بی‌ام‌دبلیو': 'bmw',
    'BMW': 'bmw',
    'چانگان': 'changan',
    'آمیکو': 'amico',
    'برلیانس': 'brilliance',
    'بنز': 'benz',
    'مرسدس': 'benz',
    'مرسدس بنز': 'benz',
    'هوندا': 'honda',
    'آئودی': 'audi',
    'مازراتی': 'maserati',
    'فراری': 'ferrari',
    'لامبورگینی': 'lamborghini',
    'پورشه': 'porsche',
    'آلفارومئو': 'alfaromeo',
    // برندهای جدید اضافه شده
    'اس دبلیو ام': 'swm',
    'SWM': 'swm',
    'دانگ فنگ': 'dongfeng',
    'Dongfeng': 'dongfeng',
    'گک-گونو': 'geek-gono',
    'گک گونو': 'geek-gono',
    'Geek Gono': 'geek-gono',
    'گک': 'geek-gono',
    'Gono': 'geek-gono',
    'گک-گونو مکث-موتور': 'geek-gono-motor',
    'Geek-Gono': 'geek-gono',
    'Geek-Gono Motor': 'geek-gono-motor',
    'مکث-موتور': 'geek-gono-motor',
    'Mekth-Motor': 'geek-gono-motor',
    'مکث موتور': 'geek-gono-motor',
    'Mekth Motor': 'geek-gono-motor',
    // برندهای جدید اضافه شده
    'فردا موتورز': 'farda-motors',
    'فردا موتور': 'farda-motors',
    'Farda Motors': 'farda-motors',
    'Farda Motor': 'farda-motors',
    'گریت وال': 'great-wall',
    'گریتوال': 'great-wall',
    'Great Wall': 'great-wall',
    'GreatWall': 'great-wall'
  };
  
  return brandMap[brandName] || 'geely';
};

// تابع برای دریافت محصولات تخفیف‌دار به صورت ثابت از دیتابیس
export const fetchFixedDiscountedProducts = async (limit = 3) => {
  try {
    const { supabase } = await import('./supabase.js');
    
    if (!supabase) {
      console.warn('Supabase client not available, using fallback data');
      return getFallbackDiscountedProducts(limit);
    }

    console.log('Fetching discounted products from database...');

    // دریافت محصولات که قیمت اصلی و قیمت تخفیف‌دار دارند
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .not('originalPrice', 'is', null)
      .not('price', 'is', null)
      .not('originalPrice', 'eq', '')
      .not('price', 'eq', '')
      .order('created_at', { ascending: false })
      .limit(100); // دریافت تعداد بیشتری برای انتخاب بهتر

    if (error) {
      console.error('Error fetching discounted products:', error);
      return getFallbackDiscountedProducts(limit);
    }

    if (!products || products.length === 0) {
      console.log('No products with two prices found in database');
      return getFallbackDiscountedProducts(limit);
    }

    console.log(`Found ${products.length} products with two prices`);

    // فیلتر کردن محصولاتی که واقعاً دو قیمت متفاوت دارند
    const validProducts = products.filter(product => {
      try {
        if (!product.originalPrice || !product.price) return false;
        
        // تبدیل قیمت‌ها به عدد
        const originalPrice = parseFloat(product.originalPrice.toString().replace(/[^\d]/g, ''));
        const currentPrice = parseFloat(product.price.toString().replace(/[^\d]/g, ''));
        
        // بررسی اینکه قیمت‌ها معتبر و متفاوت باشند
        return originalPrice > 0 && currentPrice > 0 && originalPrice !== currentPrice;
      } catch (e) {
        console.warn('Error parsing prices for product:', product.id, e);
        return false;
      }
    });

    console.log(`Found ${validProducts.length} valid products with different prices`);

    if (validProducts.length === 0) {
      console.log('No valid products with different prices found');
      return getFallbackDiscountedProducts(limit);
    }

    // انتخاب سه محصول ثابت با لوگو (اولین محصولات معتبر)
    const selectedProducts = validProducts.slice(0, 3);

    console.log(`Selected ${selectedProducts.length} fixed products`);

    // تبدیل به فرمت مورد نیاز
    return selectedProducts.map((product, index) => {
      const originalPrice = parseFloat(product.originalPrice.toString().replace(/[^\d]/g, ''));
      const currentPrice = parseFloat(product.price.toString().replace(/[^\d]/g, ''));
      const discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
      
      // انتخاب رنگ‌های مختلف برای هر کارت
      const colorSchemes = [
        { bgColor: "from-red-500 to-pink-500", textColor: "text-white" },
        { bgColor: "from-blue-500 to-purple-500", textColor: "text-white" },
        { bgColor: "from-green-500 to-teal-500", textColor: "text-white" }
      ];

      return {
        id: product.id,
        title: product.name && product.name.length > 30 ? product.name.substring(0, 30) + '...' : (product.name || 'محصول تخفیف‌دار'),
        subtitle: product.brand || 'برند نامشخص',
        discount: `${discountPercentage}%`,
        originalPrice: product.originalPrice.toString(),
        newPrice: product.price.toString(),
        image: product.image || `/${getBrandImageName(product.brand)}.png`,
        bgColor: colorSchemes[index % colorSchemes.length].bgColor,
        textColor: colorSchemes[index % colorSchemes.length].textColor,
        targetLink: `/product/${product.id}`,
        product: product
      };
    });

  } catch (error) {
    console.error('Error in fetchRandomDiscountedProducts:', error);
    return getFallbackDiscountedProducts(limit);
  }
};

// تابع پشتیبان برای زمانی که دیتابیس در دسترس نیست
const getFallbackDiscountedProducts = (limit) => {
  const fallbackProducts = [
    {
      id: 1,
      title: "ترمز جلو پژو 407",
      subtitle: "پژو",
      discount: "25%",
      originalPrice: "800,000",
      newPrice: "600,000",
      image: "/peugeot.png",
      bgColor: "from-red-500 to-pink-500",
      textColor: "text-white",
      targetLink: "/brands/peugeot"
    },
    {
      id: 2,
      title: "ترمز جلو زانتیا 1800",
      subtitle: "زانتیا",
      discount: "30%",
      originalPrice: "750,000",
      newPrice: "525,000",
      image: "/peugeot.png",
      bgColor: "from-blue-500 to-purple-500",
      textColor: "text-white",
      targetLink: "/brands/peugeot"
    },
    {
      id: 3,
      title: "ترمز جلو نیسان ماکسیما آفورتیس",
      subtitle: "نیسان",
      discount: "20%",
      originalPrice: "900,000",
      newPrice: "720,000",
      image: "/nissan.png",
      bgColor: "from-green-500 to-teal-500",
      textColor: "text-white",
      targetLink: "/brands/nissan"
    }
  ];

  return fallbackProducts.slice(0, limit);
};

// تابع برای تست اتصال به دیتابیس و نمایش محصولات موجود
export const testDatabaseConnection = async () => {
  try {
    const { supabase } = await import('./supabase.js');
    
    if (!supabase) {
      console.warn('Supabase client not available');
      return {
        connected: false,
        error: 'Supabase client not initialized',
        products: []
      };
    }

    console.log('Testing database connection...');
    
    // تست اتصال ساده
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Database connection test failed:', testError);
      return {
        connected: false,
        error: testError.message,
        products: []
      };
    }

    console.log('Database connection successful');
    
    // دریافت همه محصولات برای بررسی
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(10);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return {
        connected: true,
        error: productsError.message,
        products: []
      };
    }

    console.log('All products found:', allProducts);
    
    // بررسی محصولات با تخفیف
    const productsWithDiscount = allProducts.filter(product => {
      try {
        if (!product.originalPrice || !product.price) return false;
        const originalPrice = parseFloat(product.originalPrice.replace(/,/g, ''));
        const currentPrice = parseFloat(product.price.replace(/,/g, ''));
        return originalPrice > currentPrice && originalPrice > 0 && currentPrice > 0;
      } catch (e) {
        return false;
      }
    });

    console.log('Products with discount:', productsWithDiscount);

    return {
      connected: true,
      error: null,
      products: allProducts,
      productsWithDiscount: productsWithDiscount,
      totalProducts: allProducts.length,
      discountedProducts: productsWithDiscount.length
    };

  } catch (error) {
    console.error('Error in testDatabaseConnection:', error);
    return {
      connected: false,
      error: error.message,
      products: []
    };
  }
};
