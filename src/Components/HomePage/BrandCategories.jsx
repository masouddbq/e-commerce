import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getBrandImage } from '../../lib/utils';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BrandCategories = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        
        if (!supabase) {
          console.warn('Supabase not available');
          return;
        }
        
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching brands:', error);
          // در صورت خطا، برندهای پیش‌فرض را اضافه کن
          setBrands([
            { id: 1, name: 'سایپا', image: '/saipa.png', slug: getBrandSlug('سایپا') },
            { id: 2, name: 'ایران خودرو', image: '/irankhodro.png', slug: getBrandSlug('ایران خودرو') },
            { id: 3, name: 'پژو', image: '/peugeot.png', slug: getBrandSlug('پژو') },
            { id: 4, name: 'هیوندای', image: '/hyun.png', slug: getBrandSlug('هیوندای') },
            { id: 5, name: 'نیسان', image: '/nissan.png', slug: getBrandSlug('نیسان') },
            { id: 6, name: 'تویوتا', image: '/toyota.png', slug: getBrandSlug('تویوتا') },
            { id: 7, name: 'لکسوس', image: '/lexus.png', slug: getBrandSlug('لکسوس') },
            { id: 8, name: 'کیا', image: '/kia.png', slug: getBrandSlug('کیا') },
          ]);
        } else {
          // دریافت برندها از جدول brands
          let allBrands = data || [];
          
          // همچنین برندها را از جدول products دریافت کن تا همه برندها نمایش داده شوند
          try {
            const { data: productBrands, error: productBrandsError } = await supabase
              .from('products')
              .select('brand')
              .not('brand', 'is', null)
              .not('brand', 'eq', '');
            
            if (!productBrandsError && productBrands) {
              const uniqueProductBrands = [...new Set(productBrands.map(p => p.brand))];
              console.log('Brands from products table:', uniqueProductBrands);
              
              // اضافه کردن برندهای موجود در محصولات که در جدول brands نیستند
              const existingBrandNames = allBrands.map(b => b.name);
              const missingBrands = uniqueProductBrands.filter(brandName => 
                !existingBrandNames.includes(brandName)
              );
              
              console.log('Missing brands to add:', missingBrands);
              
              // اضافه کردن برندهای گمشده
              missingBrands.forEach(brandName => {
                allBrands.push({
                  id: `product_${brandName}`,
                  name: brandName,
                  image: getBrandImage(brandName), // استفاده از سیستم متمرکز
                  slug: getBrandSlug(brandName)
                });
              });
            }
          } catch (error) {
            console.error('Error fetching brands from products:', error);
          }
          
          // استفاده از سیستم متمرکز برای تصاویر
          const brandsWithImages = allBrands.map(brand => ({
            id: brand.id,
            name: brand.name,
            image: brand.image || getBrandImage(brand.name), // استفاده از سیستم متمرکز
            slug: getBrandSlug(brand.name)
          }));
          
          // فیلتر کردن برندهای نامطلوب از سمت چپ هیوندا
          // حذف: جی ای سی، جی‌ای‌سی
          // نگه داشتن: ام‌جی، فولکس‌واگن، ام جی، فولکس واگن
          const filteredBrands = brandsWithImages.filter(brand => {
            const brandName = brand.name;
            // حذف برندهای نامطلوب
            return !['جی ای سی', 'جی‌ای‌سی'].includes(brandName);
          });
          
          // سیستم یکسان‌سازی و حذف تکرار برندها
          const uniqueBrands = [];
          const seenBrands = new Set();
          
          // تابع یکسان‌سازی نام برندها
          const normalizeBrandName = (brandName) => {
            const brandMap = {
              // ام‌جی
              'ام‌جی': 'ام‌جی',
              'ام جی': 'ام‌جی',
              'MG': 'ام‌جی',
              'mg': 'ام‌جی',
              
              // فولکس‌واگن
              'فولکس‌واگن': 'فولکس‌واگن',
              'فولکس واگن': 'فولکس‌واگن',
              'Volkswagen': 'فولکس‌واگن',
              'volkswagen': 'فولکس‌واگن',
              
              // سانگ یانگ
              'سانگ یانگ': 'سانگ یانگ',
              'سانگ‌یانگ': 'سانگ یانگ',
              'Sang Yang': 'سانگ یانگ',
              'sangyang': 'سانگ یانگ',
              
              // گک-گونو
              'گک-گونو': 'گک-گونو',
              'گک گونو': 'گک-گونو',
              'Geek-Gono': 'گک-گونو',
              'Geek Gono': 'گک-گونو',
              'geek-gono': 'گک-گونو',
              
              // مکث-موتور
              'گک-گونو مکث-موتور': 'مکث-موتور',
              'مکث-موتور': 'مکث-موتور',
              'مکث موتور': 'مکث-موتور',
              'Mekth-Motor': 'مکث-موتور',
              'Mekth Motor': 'مکث-موتور',
              'geek-gono-motor': 'مکث-موتور',
              
              // اس دبلیو ام
              'اس دبلیو ام': 'اس دبلیو ام',
              'SWM': 'اس دبلیو ام',
              'swm': 'اس دبلیو ام',
              
              // دانگ فنگ
              'دانگ فنگ': 'دانگ فنگ',
              'Dongfeng': 'دانگ فنگ',
              'dongfeng': 'دانگ فنگ',
              
              // BMW
              'بی‌ام‌دبلیو': 'بی‌ام‌دبلیو',
              'BMW': 'بی‌ام‌دبلیو',
              'bmw': 'بی‌ام‌دبلیو',
              
              // چانگان
              'چانگان': 'چانگان',
              'Changan': 'چانگان',
              'changan': 'چانگان',
              
              // آمیکو
              'آمیکو': 'آمیکو',
              'Amico': 'آمیکو',
              'amico': 'آمیکو',
              
              // برلیانس
              'برلیانس': 'برلیانس',
              'Brilliance': 'برلیانس',
              'brilliance': 'برلیانس',
              
              // بنز
              'بنز': 'بنز',
              'Benz': 'بنز',
              'benz': 'بنز',
              'مرسدس': 'بنز',
              'مرسدس بنز': 'بنز',
              'Mercedes': 'بنز',
              'mercedes': 'بنز',
              
              // فردا موتورز
              'فردا موتورز': 'فردا موتورز',
              'فردا موتور': 'فردا موتورز',
              'Farda Motors': 'فردا موتورز',
              'Farda Motor': 'فردا موتورز',
              'farda-motors': 'فردا موتورز',
              'farda-motor': 'فردا موتورز',
              
              // گریت وال
              'گریت وال': 'گریت وال',
              'گریتوال': 'گریت وال',
              'Great Wall': 'گریت وال',
              'GreatWall': 'گریت وال',
              'great-wall': 'گریت وال',
              'greatwall': 'گریت وال'
            };
            
            return brandMap[brandName] || brandName;
          };
          
          filteredBrands.forEach(brand => {
            const normalizedName = normalizeBrandName(brand.name);
            
            // اگر این برند قبلاً اضافه نشده، اضافه کن
            if (!seenBrands.has(normalizedName)) {
              seenBrands.add(normalizedName);
              uniqueBrands.push({
                ...brand,
                name: normalizedName // نام یکسان شده
              });
            }
          });
          
          console.log('Final brands list (unique):', uniqueBrands);
          setBrands(uniqueBrands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // در صورت خطا، برندهای پیش‌فرض را نمایش بده
        const fallbackBrands = [
          { id: 1, name: 'سایپا', image: '/saipa.png', slug: getBrandSlug('سایپا') },
          { id: 2, name: 'ایران خودرو', image: '/irankhodro.png', slug: getBrandSlug('ایران خودرو') },
          { id: 3, name: 'پژو', image: '/peugeot.png', slug: getBrandSlug('پژو') },
          { id: 4, name: 'هیوندای', image: '/hyun.png', slug: getBrandSlug('هیوندای') },
          { id: 5, name: 'نیسان', image: '/nissan.png', slug: getBrandSlug('نیسان') },
          { id: 6, name: 'تویوتا', image: '/toyota.png', slug: getBrandSlug('تویوتا') },
          { id: 7, name: 'لکسوس', image: '/lexus.png', slug: getBrandSlug('لکسوس') },
          { id: 8, name: 'کیا', image: '/kia.png', slug: getBrandSlug('کیا') },
          { id: 9, name: 'جیلی', image: '/geely.png', slug: getBrandSlug('جیلی') },
          { id: 10, name: 'مزدا', image: '/mazda.png', slug: getBrandSlug('مزدا') },
          { id: 11, name: 'میتسوبیشی', image: '/mitsubishi.png', slug: getBrandSlug('میتسوبیشی') },
          { id: 12, name: 'سوزوکی', image: '/suzuki.png', slug: getBrandSlug('سوزوکی') },
          { id: 13, name: 'رنو', image: '/renault.png', slug: getBrandSlug('رنو') },
          { id: 14, name: 'فاو', image: '/faw.png', slug: getBrandSlug('فاو') },
          { id: 15, name: 'فولکس‌واگن', image: '/kia.png', slug: getBrandSlug('فولکس‌واگن') }, // کنار فاو
        ];
        
        // فیلتر کردن برندهای نامطلوب از سمت چپ هیوندا
        // حذف: جی ای سی، جی‌ای‌سی
        // نگه داشتن: ام‌جی، فولکس‌واگن، ام جی، فولکس واگن
        const filteredFallbackBrands = fallbackBrands.filter(brand => {
          const brandName = brand.name;
          // حذف فقط برندهای نامطلوب
          return !['جی ای سی', 'جی‌ای‌سی'].includes(brandName);
        });
        
        setBrands(filteredFallbackBrands);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();

    // Real-time subscription برای برندها
    if (supabase) {
      const channel = supabase
        .channel('brands_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'brands' }, 
          (payload) => {
            console.log('Real-time brand change:', payload);
            // بروزرسانی خودکار لیست برندها
            fetchBrands();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // تبدیل نام فارسی برند به slug انگلیسی
  const getBrandSlug = (brandName) => {
    const slugMap = {
      'تویوتا': 'toyota',
      'هیوندای': 'hyundai',
      'نیسان': 'nissan',
      'کیا': 'kia',
      'لکسوس': 'lexus',
      'جیلی': 'geely',
      'مزدا': 'mazda',
      'ام‌جی': 'mg',
      'ام جی': 'mg',
      'میتسوبیشی': 'mitsubishi',
      'فولکس‌واگن': 'volkswagen',
      'فولکس واگن': 'volkswagen',
      'سایپا': 'saipa',
      'سوزوکی': 'suzuki',
      'رنو': 'renault',
      'پژو': 'peugeot',
      'ایران خودرو': 'irankhodro',
      'فاو': 'faw',
      // برندهای جدید اضافه شده
      'بی‌ام‌دبلیو': 'bmw',
      'چانگان': 'changan',
      'آمیکو': 'amico',
      'برلیانس': 'brilliance',
      'بنز': 'benz',
      'مرسدس': 'mercedes',
      'سانگ یانگ': 'sangyang',
      'سانگ‌یانگ': 'sangyang',
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
    return slugMap[brandName] || brandName.toLowerCase().replace(/\s+/g, '-');
  };



  return (
    <div className='flex flex-col lg:flex-col justify-evenly items-center w-full px-4 sm:px-4 lg:px-4 max-w-full overflow-hidden'>
      {/* Brand Logos Carousel */}
      <div className='relative w-full mb-2 mt-24 md:mt-8 lg:mt-10 lg:mb-2 max-w-full overflow-hidden'>
        {/* دکمه‌های چپ و راست برای موبایل */}
        <button
          type='button'
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
            }
          }}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/50 hover:bg-blue-600/70 text-white shadow-lg rounded-full p-0.5 sm:p-1 transition-all duration-200'
          aria-label='قبلی'
        >
          <ArrowBackIosNewIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>
        
        <button
          type='button'
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
            }
          }}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500/50 hover:bg-blue-600/70 text-white shadow-lg rounded-full p-0.5 sm:p-1 transition-all duration-200'
          aria-label='بعدی'
        >
          <ArrowForwardIosIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>

        <div
          id="brands-carousel"
          ref={scrollRef}
          className='flex items-center gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 max-w-full'
        >
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='flex flex-col items-center justify-center p-2 snap-start flex-shrink-0'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-200 animate-pulse rounded-full'></div>
                <div className='mt-2 w-16 h-4 bg-gray-200 animate-pulse rounded'></div>
              </div>
            ))
          ) : (
            brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brand-products/${brand.slug}`}
                className='flex flex-col items-center justify-center p-2 snap-start min-w-[88px] sm:min-w-[96px] flex-shrink-0'
              >
                <img
                  className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain border-4 sm:border-6 transition-all duration-300 border-double hover:shadow-xl hover:shadow-slate-400 hover:cursor-pointer hover:scale-110 rounded-[50%] shadow-md shadow-slate-600'
                  src={brand.image}
                  alt={brand.name}
                />
                <h2 className='mt-2 font-extrabold text-xs sm:text-sm text-center'>
                  {brand.name}
                </h2>
              </Link>
            ))
          )}
        </div>
      </div>




      
 
       
    </div>
  )
}

export default BrandCategories