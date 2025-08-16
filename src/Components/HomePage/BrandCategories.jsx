import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import PanToolAltOutlinedIcon from '@mui/icons-material/PanToolAltOutlined';
import { supabase } from '../../lib/supabase';

const BrandCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  // لیست کامل نام ماشین‌ها
  const allCars = [
    // سواری
    { id: 1, name: "سایپا 131", category: "سواری", link: "/vehicle/saipa-131" },
    { id: 2, name: "سایپا 132", category: "سواری", link: "/vehicle/saipa-132" },
    { id: 3, name: "سایپا 141", category: "سواری", link: "/vehicle/saipa-141" },
    { id: 4, name: "سایپا 151", category: "سواری", link: "/vehicle/saipa-151" },
    { id: 5, name: "سایپا 111", category: "سواری", link: "/vehicle/saipa-111" },
    { id: 6, name: "پژو 206", category: "سواری", link: "/vehicle/peugeot-206" },
    { id: 7, name: "پژو 405", category: "سواری", link: "/vehicle/peugeot-405" },
    { id: 8, name: "پژو 207", category: "سواری", link: "/vehicle/peugeot-207" },
    { id: 9, name: "پژو 2008", category: "سواری", link: "/vehicle/peugeot-2008" },
    { id: 10, name: "تویوتا کمری", category: "سواری", link: "/vehicle/toyota-camry" },
    { id: 11, name: "تویوتا کرولا", category: "سواری", link: "/vehicle/toyota-corolla" },
    { id: 12, name: "تویوتا پریوس", category: "سواری", link: "/vehicle/toyota-prius" },
    { id: 13, name: "هیوندای آوانته", category: "سواری", link: "/vehicle/hyundai-avante" },
    { id: 14, name: "هیوندای اکسنت", category: "سواری", link: "/vehicle/hyundai-accent" },
    { id: 15, name: "هیوندای i10", category: "سواری", link: "/vehicle/hyundai-i10" },
    { id: 16, name: "هیوندای i20", category: "سواری", link: "/vehicle/hyundai-i20" },
    { id: 17, name: "سمند", category: "سواری", link: "/vehicle/samand" },
    { id: 18, name: "سمند LX", category: "سواری", link: "/vehicle/samand-lx" },
    { id: 19, name: "سمند EF7", category: "سواری", link: "/vehicle/samand-ef7" },
    { id: 20, name: "رنو تالیسمان", category: "سواری", link: "/vehicle/renault-talisman" },
    { id: 21, name: "رنو کولیوس", category: "سواری", link: "/vehicle/renault-captur" },
    { id: 22, name: "رنو مگان", category: "سواری", link: "/vehicle/renault-megane" },
    
    // شاسی بلند
    { id: 23, name: "جیلی", category: "شاسی بلند", link: "/suv/jili" },
    { id: 24, name: "نیسان جوک", category: "شاسی بلند", link: "/suv/nissan-juke" },
    { id: 25, name: "هیوندای توسان", category: "شاسی بلند", link: "/suv/hyundai-tucson" },
    { id: 26, name: "هیوندای سانتافه", category: "شاسی بلند", link: "/suv/hyundai-santafe" },
    { id: 27, name: "کیا اسپورتیج", category: "شاسی بلند", link: "/suv/kia-sportage" },
    { id: 28, name: "کیا سورنتو", category: "شاسی بلند", link: "/suv/kia-sorento" },
    { id: 29, name: "میتسوبیشی ASX", category: "شاسی بلند", link: "/suv/mitsubishi-asx" },
    { id: 30, name: "میتسوبیشی اوتلندر", category: "شاسی بلند", link: "/suv/mitsubishi-outlander" },
    { id: 31, name: "هوندا CR-V", category: "شاسی بلند", link: "/suv/honda-crv" },
    { id: 32, name: "هوندا HR-V", category: "شاسی بلند", link: "/suv/honda-hrv" },
    
    // دیزل و پیکاپ
    { id: 33, name: "نیسان دیزل", category: "دیزل", link: "/pickup/nissan-diesel" },
    { id: 34, name: "نیسان ناوارا", category: "دیزل", link: "/pickup/nissan-navara" },
    { id: 35, name: "تویوتا هیلوکس", category: "دیزل", link: "/pickup/toyota-hilux" },
    { id: 36, name: "تویوتا لندکروزر", category: "دیزل", link: "/pickup/toyota-landcruiser" },
    { id: 37, name: "میتسوبیشی L200", category: "دیزل", link: "/pickup/mitsubishi-l200" },
    { id: 38, name: "فورد رنجر", category: "دیزل", link: "/pickup/ford-ranger" },
    { id: 39, name: "ایسوزو D-Max", category: "دیزل", link: "/pickup/isuzu-dmax" },
    { id: 40, name: "مازدا BT-50", category: "دیزل", link: "/pickup/mazda-bt50" }
  ];

  // دریافت برندها از دیتابیس
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        if (!supabase) {
          // در صورت عدم تنظیم Supabase، از داده‌های پیش‌فرض استفاده کن
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
          // تبدیل نام‌های فارسی به انگلیسی برای URL
          const brandsWithImages = data.map(brand => {
            const imageMap = {
              'سایپا': '/saipa.png',
              'ایران خودرو': '/irankhodro.png',
              'پژو': '/peugeot.png',
              'هیوندای': '/hyun.png',
              'نیسان': '/nissan.png',
              'تویوتا': '/toyota.png',
              'لکسوس': '/lexus.png',
              'کیا': '/kia.png',
              'جیلی': '/geely.png',
              'مزدا': '/mazda.png',
              'ام‌جی': '/mg.png',
              'ام جی': '/mg.png',
              'میتسوبیشی': '/mitsubishi.png',
              'فولکس‌واگن': '/volkswagen.png',
              'فولکس واگن': '/volkswagen.jpg',
              'سوزوکی': '/suzuki.png',
              'رنو': '/renault.png',
              'فاو': '/faw.png',
              'جی‌ای‌سی': '/jac.png',
              'جک': '/jac.png'
            };
            
            return {
              id: brand.id,
              name: brand.name,
              image: imageMap[brand.name] || '/default-brand.png',
              slug: getBrandSlug(brand.name)
            };
          });
          setBrands(brandsWithImages);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // در صورت خطا، برندهای پیش‌فرض را نمایش بده
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
      'جی‌ای‌سی': 'jac',
      'جک': 'jac'
    };
    return slugMap[brandName] || brandName.toLowerCase().replace(/\s+/g, '-');
  };

  // فیلتر کردن ماشین‌ها بر اساس متن جستجو
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCars([]);
      setShowResults(false);
      return;
    }

    const filtered = allCars.filter(car =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCars(filtered.slice(0, 10)); // حداکثر 10 نتیجه
    setShowResults(filtered.length > 0);
  }, [searchTerm]);

  // بستن نتایج با کلیک خارج از جستجو
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('جستجو برای:', searchTerm);
      setShowResults(false);
    }
  };

  const handleCarSelect = (car) => {
    setSearchTerm(car.name);
    setShowResults(false);
    // می‌تونید کاربر رو به صفحه محصول هدایت کنید
    // window.location.href = car.link;
  };

  return (
    <div className='flex flex-col lg:flex-row justify-evenly items-center w-full px-12 sm:px-4 lg:px-4'>
      {/* Search Section */}
      <div className='w-full lg:w-auto flex flex-col justify-center items-center mb-12 lg:mb-28'>
        <h1 className='text-xl sm:text-2xl font-bold text-center mb-4'>از دسته بندی برند مورد نظرت شروع کن...</h1>
        
        {/* Search Input with Smart Search */}
        <div className='flex items-center justify-center gap-2 m-4 relative' ref={searchRef}>
          <input 
            className='border w-64 sm:w-72 text-center outline-none border-gray-300 rounded-md shadow-md shadow-slate-300 px-4 py-2 text-sm sm:text-base' 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="نام ماشین خود را جستجو کنید..."
          />
          <div className='transition-all duration-300 hover:scale-[1.2]'>
            <ZoomInIcon 
              className='cursor-pointer scale-125 bg-blue-500 text-white rounded-md p-0.5' 
              onClick={handleSearch}
            />
          </div>

          {/* نتایج جستجو */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50 w-64 sm:w-72">
              <div className="p-2">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => handleCarSelect(car)}
                    className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">
                          {car.category.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-blue-600 text-sm">
                          {car.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {car.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      →
                    </div>
                  </div>
                ))}
                
                {filteredCars.length === 0 && searchTerm.trim() !== '' && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    هیچ ماشینی با این نام یافت نشد
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <h1 className='flex items-center gap-2 text-sm sm:text-base'>
          <PanToolAltOutlinedIcon className='scale-110' />
          اینجا جستجو کن...
        </h1>
      </div>

      {/* Brand Logos Grid */}
      <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-4 lg:gap-1 w-full lg:w-auto mb-12 lg:mb-28'>
        {loading ? (
          // Skeleton loader برای برندها
          Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className='flex flex-col justify-evenly items-center p-2'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gray-200 animate-pulse rounded-full'></div>
              <div className='mt-2 sm:mt-3 lg:mt-4 w-16 h-4 bg-gray-200 animate-pulse rounded'></div>
            </div>
          ))
        ) : (
          brands.map(brand => (
            <Link key={brand.id} to={`/brands/${brand.slug}`} className='flex flex-col justify-evenly items-center p-2 group'>
              <img 
                className='w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-24 object-contain border-4 sm:border-6 lg:border-8 transition-all duration-300 border-double hover:shadow-xl hover:shadow-slate-400 hover:cursor-pointer hover:scale-110 rounded-[50%] shadow-md shadow-slate-600 group-hover:border-blue-500' 
                src={brand.image} 
                alt={brand.name} 
              />
              <h2 className='mt-2 sm:mt-3 lg:mt-4 font-extrabold text-xs sm:text-sm md:text-base lg:text-lg text-center group-hover:text-blue-600 transition-colors duration-300'>
                {brand.name}
              </h2>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default BrandCategories