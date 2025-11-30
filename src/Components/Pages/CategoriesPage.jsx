import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getBrandImage } from '../../lib/utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import Breadcrumbs from '../Common/Breadcrumbs';

const CategoriesPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
    
    // تست ساختار جدول brands
    const testBrandsTable = async () => {
      try {
        const { data: testData, error: testError } = await supabase
          .from('brands')
          .select('*')
          .limit(1);
        
        if (!testError && testData && testData.length > 0) {
          console.log('Brands table structure:', Object.keys(testData[0]));
          console.log('Sample brand data:', testData[0]);
        }
      } catch (error) {
        console.error('Error testing brands table:', error);
      }
    };
    
    testBrandsTable();
    
    // Real-time subscription برای برندها
    if (supabase) {
      const channel = supabase
        .channel('categories_brands_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'brands' }, 
          (payload) => {
            console.log('Real-time brand change in CategoriesPage:', payload);
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

  const normalizeBrandName = (name) => (name || '').replace(/\u200c/g, ' ').replace(/\s+/g, ' ').trim();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching brands:', error);
        // Fallback to hardcoded brands
        const fallback = [
          { id: 1, name: 'تویوتا', description: 'برند تویوتا' },
          { id: 2, name: 'هیوندای', description: 'برند هیوندای' },
          { id: 3, name: 'نیسان', description: 'برند نیسان' },
          { id: 4, name: 'کیا', description: 'برند کیا' },
          { id: 5, name: 'لکسوس', description: 'برند لکسوس' },
          { id: 6, name: 'جیلی', description: 'برند جیلی' },
          { id: 7, name: 'مزدا', description: 'برند مزدا' },
          { id: 8, name: 'میتسوبیشی', description: 'برند میتسوبیشی' },
          { id: 9, name: 'سایپا', description: 'برند سایپا' },
          { id: 10, name: 'سوزوکی', description: 'برند سوزوکی' },
          { id: 11, name: 'رنو', description: 'برند رنو' },
          { id: 12, name: 'پژو', description: 'برند پژو' },
          { id: 13, name: 'ایران خودرو', description: 'برند ایران خودرو' },
          { id: 14, name: 'فاو', description: 'برند فاو' },
          { id: 15, name: 'فولکس‌واگن', description: 'برند فولکس‌واگن' }, // کنار فاو
          { id: 16, name: 'ام‌جی', description: 'برند ام‌جی' }, // از سمت راست سوم
          { id: 17, name: 'چانگان', description: 'برند چانگان' },
          { id: 18, name: 'آمیکو', description: 'برند آمیکو' },
          { id: 19, name: 'برلیانس', description: 'برند برلیانس' },
          { id: 20, name: 'بنز', description: 'برند مرسدس بنز' },
          { id: 21, name: 'بی‌ام‌دبلیو', description: 'برند بی‌ام‌دبلیو' }
        ];
        const mapped = fallback.map((b) => {
          const n = normalizeBrandName(b.name);
          return {
            id: b.id,
            name: b.name,
            image: getBrandImage(n), // استفاده از سیستم متمرکز
            slug: getBrandSlug(n)
          };
        });
        setBrands(mapped);
      } else {
        console.log('Brands data from database:', data);
        const mapped = (data || []).map((b) => {
          const n = normalizeBrandName(b.name);
          console.log(`Brand: ${b.name}, DB Image: ${b.image}`);
          return {
            id: b.id,
            name: b.name,
            // فقط از تصویر دیتابیس استفاده کن
            image: b.image,
            slug: getBrandSlug(n)
          };
        });
        
        console.log('Mapped brands:', mapped);
        // نمایش همه برندها بدون فیلتر کردن
        setBrands(mapped);
      }
    } catch (error) {
      console.error('Error:', error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const getBrandSlug = (brandName) => {
    const brandMap = {
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
      'چانگان': 'changan',
      'آمیکو': 'amico',
      'برلیانس': 'brilliance',
      'بنز': 'benz',
      'مرسدس': 'benz',
      'مرسدس بنز': 'benz',
      'بی‌ام‌دبلیو': 'bmw'
    };
    return brandMap[brandName] || brandName.toLowerCase();
  };

  const filteredBrands = brands;

  const vehicleTypes = [
    {
      id: 'vehicle',
      name: 'سواری',
      description: 'خودروهای سواری و شخصی',
      icon: <DirectionsCarIcon className="text-4xl text-blue-600" />,
      link: '/vehicle',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'suv',
      name: 'شاسی بلند',
      description: 'خودروهای شاسی بلند و SUV',
      icon: <LocalShippingIcon className="text-4xl text-green-600" />,
      link: '/suv',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'pickup',
      name: 'وانت',
      description: 'خودروهای وانت و پیکاپ',
      icon: <TwoWheelerIcon className="text-4xl text-orange-600" />,
      link: '/pickup',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>دسته‌بندی‌ها و برندها | تمام برندهای لنت ترمز | لنت شاپ</title>
        <meta name="description" content="دسته‌بندی کامل محصولات لنت شاپ - لنت خودروهای سواری، شاسی بلند و وانت. تمام برندهای معتبر لنت ترمز با بهترین قیمت و کیفیت." />
        <meta name="keywords" content="دسته‌بندی لنت, برندهای لنت, لنت تویوتا, لنت هیوندای, لنت نیسان, لنت کیا, دسته‌بندی محصولات" />
        <meta property="og:title" content="دسته‌بندی‌ها و برندها | لنت شاپ" />
        <meta property="og:description" content="دسته‌بندی کامل محصولات لنت ترمز برای تمام برندها و انواع خودرو" />
        <meta property="og:url" content="https://lent-shop.ir/categories" />
        <link rel="canonical" href="https://lent-shop.ir/categories" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile Layout - Stacked */}
          <div className="block sm:hidden">
            <div className="flex justify-center mb-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowBackIcon className="ml-2" />
                <span className="text-lg font-medium">بازگشت به خانه</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 text-center">دسترسی سریع به دسته‌بندی‌ها</h1>
          </div>
          
          {/* Desktop Layout - Horizontal */}
          <div className="hidden sm:flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowBackIcon className="ml-2" />
              <span className="text-lg font-medium">بازگشت به خانه</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">دسترسی سریع به دسته‌بندی‌ها</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            پیدا کردن محصولات مورد نظرتان
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            با استفاده از این صفحه می‌توانید به سرعت به تمام دسته‌بندی‌های موجود دسترسی پیدا کنید 
            و محصولات مورد نظرتان را در کمترین زمان ممکن بیابید.
          </p>
        </div>

        {/* Vehicle Types Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">دسته‌بندی‌های اصلی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicleTypes.map((type) => (
              <Link
                key={type.id}
                to={type.link}
                className="group block"
              >
                <div className={`bg-gradient-to-br ${type.color} rounded-2xl p-8 text-center text-white transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl shadow-xl`}>
                  <div className="mb-4 flex justify-center">
                    <div className="bg-white/20 rounded-full p-4">
                      {type.icon}
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold mb-2">{type.name}</h4>
                  <p className="text-white/90 text-sm leading-relaxed">{type.description}</p>
                  <div className="mt-4 text-white/80 text-sm">
                    کلیک کنید →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
            برندهای موجود ({filteredBrands.length})
          </h3>
          
          {filteredBrands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">برندی با این نام یافت نشد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brand-products/${brand.slug || getBrandSlug(brand.name)}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transform transition-all duration-300 group-hover:scale-105 border border-gray-100">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => { 
                          console.log(`Error loading image for ${brand.name}, using fallback`);
                          e.currentTarget.src = '/WEBP/geely.webp'; 
                        }}
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 leading-tight">
                      {brand.name}
                    </h4>
                    <div className="text-xs text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                      مشاهده محصولات
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              نیاز به کمک دارید؟
            </h3>
            <p className="text-gray-600 mb-6">
              اگر محصول مورد نظرتان را پیدا نکردید، با ما تماس بگیرید تا راهنمایی‌تان کنیم.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 shadow-lg"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoriesPage;
