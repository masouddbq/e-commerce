import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getBrandImage } from '../../lib/utils';
import ProductCard from '../Common/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';

const BrandProductsPage = () => {
  const { brandSlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPadBrand, setSelectedPadBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [padBrands, setPadBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    console.log('BrandProductsPage mounted with brandSlug:', brandSlug);
    fetchBrandData();
  }, [brandSlug]);

  // تبدیل slug به نام فارسی برند
  const getBrandNameFromSlug = (slug) => {
    const brandMap = {
      'toyota': 'تویوتا',
      'hyundai': 'هیوندای',
      'nissan': 'نیسان',
      'kia': 'کیا',
      'lexus': 'لکسوس',
      'geely': 'جیلی',
      'mazda': 'مزدا',
      'mg': 'ام‌جی',
      'mitsubishi': 'میتسوبیشی',
      'volkswagen': 'فولکس‌واگن',
      'volkswagen-alt': 'فولکس واگن',
      'saipa': 'سایپا',
      'suzuki': 'سوزوکی',
      'renault': 'رنو',
      'peugeot': 'پژو',
      'irankhodro': 'ایران خودرو',
      'faw': 'فاو',
      'jac': 'جی‌ای‌سی',
      'bmw': 'بی‌ام‌دبلیو',
      'بی-ام-دبلیو': 'بی‌ام‌دبلیو',
      'changan': 'چانگان',
      'amico': 'آمیکو',
      'brilliance': 'برلیانس',
      'benz': 'بنز',
      'mercedes': 'بنز',
      'sangyang': 'سانگ یانگ',
      'sang-yang': 'سانگ یانگ',
      // برندهای جدید اضافه شده
      'swm': 'اس دبلیو ام',
      'swm-motor': 'اس دبلیو ام',
      'dongfeng': 'دانگ فنگ',
      'geek-gono': 'گک-گونو',
      'geek-gono-alt': 'گک گونو',
      'geek-gono-space': 'گک گونو',
      'geek-gono-motor': 'مکث-موتور',
      'geek-gono-mekth-motor': 'مکث-موتور',
      'mekth-motor': 'مکث-موتور',
      'mekth-motor-alt': 'مکث-موتور',
      // برندهای جدید اضافه شده
      'farda-motors': 'فردا موتورز',
      'farda-motor': 'فردا موتورز',
      'great-wall': 'گریت وال',
      'greatwall': 'گریت وال'
    };
    return brandMap[slug] || slug;
  };

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      const brandName = getBrandNameFromSlug(brandSlug);
      setBrandName(brandName);

      console.log('Fetching all products for brand:', brandName);
      
      // دریافت همه محصولات این برند خودرو
      // جستجو با نام‌های مختلف برای هر برند
      let brandNames = [brandName];
      
      // سیستم جستجوی هوشمند برای همه برندها
      const getBrandVariations = (brandName) => {
        const brandVariations = {
          // ام‌جی
          'ام‌جی': ['ام‌جی', 'ام جی', 'MG', 'mg'],
          
          // فولکس‌واگن
          'فولکس‌واگن': ['فولکس‌واگن', 'فولکس واگن', 'Volkswagen', 'volkswagen'],
          
          // سانگ یانگ
          'سانگ یانگ': ['سانگ یانگ', 'سانگ‌یانگ', 'Sang Yang', 'sangyang'],
          
          // گک-گونو
          'گک-گونو': ['گک-گونو', 'گک گونو', 'Geek-Gono', 'Geek Gono', 'geek-gono', 'گک', 'Gono'],
          
          // مکث-موتور
          'مکث-موتور': ['مکث-موتور', 'مکث موتور', 'Mekth-Motor', 'Mekth Motor', 'geek-gono-motor', 'گک-گونو مکث-موتور', 'Geek-Gono Motor'],
          
          // اس دبلیو ام
          'اس دبلیو ام': ['اس دبلیو ام', 'SWM', 'swm'],
          
          // دانگ فنگ
          'دانگ فنگ': ['دانگ فنگ', 'Dongfeng', 'dongfeng'],
          
          // BMW
          'بی‌ام‌دبلیو': ['بی‌ام‌دبلیو', 'BMW', 'bmw'],
          
          // چانگان
          'چانگان': ['چانگان', 'Changan', 'changan'],
          
          // آمیکو
          'آمیکو': ['آمیکو', 'Amico', 'amico'],
          
          // برلیانس
          'برلیانس': ['برلیانس', 'Brilliance', 'brilliance'],
          
          // بنز
          'بنز': ['بنز', 'Benz', 'benz', 'مرسدس', 'مرسدس بنز', 'Mercedes', 'mercedes'],
          
          // فردا موتورز
          'فردا موتورز': ['فردا موتورز', 'فردا موتور', 'Farda Motors', 'Farda Motor', 'farda-motors', 'farda-motor'],
          
          // گریت وال
          'گریت وال': ['گریت وال', 'گریتوال', 'Great Wall', 'GreatWall', 'great-wall', 'greatwall'],
          
          // تویوتا
          'تویوتا': ['تویوتا', 'Toyota', 'toyota'],
          
          // هیوندای
          'هیوندای': ['هیوندای', 'Hyundai', 'hyundai'],
          
          // نیسان
          'نیسان': ['نیسان', 'Nissan', 'nissan'],
          
          // کیا
          'کیا': ['کیا', 'Kia', 'kia'],
          
          // لکسوس
          'لکسوس': ['لکسوس', 'Lexus', 'lexus'],
          
          // جیلی
          'جیلی': ['جیلی', 'Geely', 'geely'],
          
          // مزدا
          'مزدا': ['مزدا', 'Mazda', 'mazda'],
          
          // میتسوبیشی
          'میتسوبیشی': ['میتسوبیشی', 'Mitsubishi', 'mitsubishi'],
          
          // سوزوکی
          'سوزوکی': ['سوزوکی', 'Suzuki', 'suzuki'],
          
          // رنو
          'رنو': ['رنو', 'Renault', 'renault'],
          
          // پژو
          'پژو': ['پژو', 'Peugeot', 'peugeot'],
          
          // ایران خودرو
          'ایران خودرو': ['ایران خودرو', 'Iran Khodro', 'irankhodro'],
          
          // فاو
          'فاو': ['فاو', 'FAW', 'faw'],
          
          // سایپا
          'سایپا': ['سایپا', 'Saipa', 'saipa']
        };
        
        return brandVariations[brandName] || [brandName];
      };
      
      brandNames = getBrandVariations(brandName);
      
      console.log('Searching for brand names:', brandNames);
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('brand', brandNames)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw new Error('خطا در دریافت محصولات');
      }

      console.log('Products found:', productsData?.length || 0, 'for brand:', brandName);
      
      // استخراج برندهای لنت و دسته‌بندی‌های منحصر به فرد
      const uniquePadBrands = [...new Set(productsData?.map(p => p.padbrand || p.padBrand).filter(Boolean))];
      const uniqueCategories = [...new Set(productsData?.map(p => p.category).filter(Boolean))];
      
      setPadBrands(uniquePadBrands);
      setCategories(uniqueCategories);
      setProducts(productsData || []);
      setFilteredProducts(productsData || []);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // فیلتر کردن محصولات
  useEffect(() => {
    let filtered = products;

    if (selectedPadBrand) {
      filtered = filtered.filter(product => (product.padbrand || product.padBrand) === selectedPadBrand);
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [selectedPadBrand, selectedCategory, products]);

  // پاک کردن فیلترها
  const clearFilters = () => {
    setSelectedPadBrand('');
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowBackIcon />
            <span className="text-sm">بازگشت</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 text-right">
            محصولات برند {brandName}
          </h1>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 text-right">فیلترها</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FilterListIcon />
              <span className="text-sm">{showFilters ? 'مخفی کردن' : 'نمایش'} فیلترها</span>
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* فیلتر برند لنت */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">برند لنت:</label>
                <select
                  value={selectedPadBrand}
                  onChange={(e) => setSelectedPadBrand(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">همه برندهای لنت</option>
                  {padBrands.map((padBrand) => (
                    <option key={padBrand} value={padBrand}>
                      {padBrand}
                    </option>
                  ))}
                </select>
              </div>

              {/* فیلتر دسته‌بندی */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">دسته‌بندی:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">همه دسته‌بندی‌ها</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* دکمه پاک کردن فیلترها */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredProducts.length} محصول یافت شد
              {selectedPadBrand && ` برای برند لنت ${selectedPadBrand}`}
              {selectedCategory && ` در دسته‌بندی ${selectedCategory}`}
            </p>
            {filteredProducts.length > 0 && (
              <p className="text-sm text-gray-500">
                نمایش همه محصولات برند {brandName} از تمام برندهای لنت
              </p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <ShoppingCartIcon className="text-6xl mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">محصولی یافت نشد</h3>
            <p className="text-gray-500 mb-6">
              {selectedPadBrand || selectedCategory 
                ? 'با فیلترهای انتخاب شده محصولی یافت نشد. فیلترها را تغییر دهید.'
                : `برای برند ${brandName} محصولی یافت نشد.`
              }
            </p>
            {selectedPadBrand || selectedCategory ? (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                پاک کردن فیلترها
              </button>
            ) : (
              <Link
                to="/categories"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                بازگشت به دسته‌بندی‌ها
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProductsPage;
