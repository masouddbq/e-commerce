import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCart } from '../Common/CartContext';
import { formatPrice } from '../../lib/utils';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrakeBrand, setSelectedBrakeBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brakeBrands, setBrakeBrands] = useState([]);
  const [navigating, setNavigating] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  // تابع برای رفتن به صفحه جزئیات محصول
  const handleProductClick = (productId) => {
    setNavigating(true);
    // کمی تاخیر برای نمایش loading
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 100);
  };

  // تابع برای افزودن محصول به سبد خرید
  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) return;
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      // بررسی قیمت محصول
      let unitPrice = 0;
      if (product.price) {
        unitPrice = product.price;
      } else if (product.originalPrice) {
        unitPrice = product.originalPrice;
      } else if (product.currentPrice) {
        unitPrice = product.currentPrice;
      }
      
      if (!unitPrice || unitPrice <= 0) {
        alert('قیمت این محصول نامشخص است و نمی‌تواند به سبد خرید اضافه شود.');
        return;
      }
      
      // افزودن به سبد خرید
      addToCart({
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image,
        brand: product.brand,
        category: product.category
      }, 1);
      
      // نمایش بازخورد بصری موفقیت
      setAddedToCart(prev => ({ ...prev, [product.id]: true }));
      
      // بعد از 2 ثانیه بازخورد را پاک کن
      setTimeout(() => {
        setAddedToCart(prev => ({ ...prev, [product.id]: false }));
      }, 2000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('خطا در افزودن به سبد خرید');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  // دریافت محصولات از دیتابیس
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        if (supabase) {
          // جستجوی هوشمند در دیتابیس (بدون حساسیت به ترتیب کلمات)
          const searchQuery = searchTerm.replace(/-/g, ' ');
          
          // تقسیم کلمات جستجو به کلمات جداگانه
          const searchWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
          
          // دریافت تمام محصولات
          const { data: allData, error: fetchError } = await supabase
            .from('products')
            .select('*');

          if (fetchError) {
            console.error('Error fetching products:', fetchError);
            setProducts([]);
            setFilteredProducts([]);
            setBrands([]);
            setCategories([]);
            setBrakeBrands([]);
            return;
          }

          // فیلتر کردن نتایج بر اساس همه کلمات (هوشمند)
          const filteredResults = (allData || []).filter(product => {
            // برای هر محصول، تمام فیلدهای قابل جستجو رو در یک رشته جمع می‌کنیم
            const searchableText = [
              product.name,
              product.brand,
              product.category,
              product.suitableFor,
              product.description,
              product.vehicleType
            ].filter(Boolean).join(' ').toLowerCase();
            
            // بررسی اینکه آیا همه کلمات جستجو در متن قابل جستجو وجود دارند
            return searchWords.every(word => 
              searchableText.includes(word.toLowerCase())
            );
          });

          // مرتب‌سازی نتایج بر اساس میزان تطابق
          // محصولاتی که کلمات جستجو در نام یا برند آن‌ها باشد، اولویت بالاتری دارند
          const sortedResults = filteredResults.sort((a, b) => {
            const aText = `${a.name || ''} ${a.brand || ''}`.toLowerCase();
            const bText = `${b.name || ''} ${b.brand || ''}`.toLowerCase();
            
            const aMatches = searchWords.filter(word => aText.includes(word.toLowerCase())).length;
            const bMatches = searchWords.filter(word => bText.includes(word.toLowerCase())).length;
            
            return bMatches - aMatches; // بیشترین تطابق اول
          });

          setProducts(sortedResults);
          setFilteredProducts(sortedResults);
          
          // استخراج برندها، دسته‌بندی‌ها و برندهای لنت از نتایج جستجو
          if (sortedResults && sortedResults.length > 0) {
            // فقط برندهایی که واقعاً در نتایج جستجو هستند
            const uniqueBrands = [...new Set(sortedResults.map(p => p.brand).filter(Boolean))].sort();
            const uniqueCategories = [...new Set(sortedResults.map(p => p.category).filter(Boolean))].sort();
            const uniqueBrakeBrands = [...new Set(sortedResults.map(p => p.brakeBrand || p.padbrand).filter(Boolean))].sort();
            
            setBrands(uniqueBrands);
            setCategories(uniqueCategories);
            setBrakeBrands(uniqueBrakeBrands);

            // تنظیم خودکار فیلترها بر اساس کلمه جستجو
            autoSetFilters(searchQuery, sortedResults);
            
            // نمایش اطلاعات دیباگ
            console.log('نتایج جستجو هوشمند:', {
              searchTerm: searchQuery,
              searchWords: searchWords,
              totalResults: sortedResults.length,
              brands: uniqueBrands,
              categories: uniqueCategories,
              brakeBrands: uniqueBrakeBrands
            });
          } else {
            // اگر نتیجه‌ای پیدا نشد، فیلترها را خالی کن
            setBrands([]);
            setCategories([]);
            setBrakeBrands([]);
          }
        } else {
          // داده‌های نمونه در صورت عدم دسترسی به دیتابیس
          const sampleProducts = [
            {
              id: 1,
              name: `لنت جلو ${searchTerm}`,
              brand: 'سایپا',
              category: 'لنت جلو',
              brakeBrand: 'فرودو',
              price: 150000,
              image: '/saipa.png',
              description: `لنت ترمز جلو مناسب ${searchTerm}`
            },
            {
              id: 2,
              name: `لنت عقب ${searchTerm}`,
              brand: 'ایران خودرو',
              category: 'لنت عقب',
              brakeBrand: 'مترو',
              price: 120000,
              image: '/irankhodro.png',
              description: `لنت ترمز عقب مناسب ${searchTerm}`
            },
            {
              id: 3,
              name: `لنت جلو ${searchTerm} - برند معتبر`,
              brand: 'پژو',
              category: 'لنت جلو',
              brakeBrand: 'بوش',
              price: 180000,
              image: '/peugeot.png',
              description: `لنت ترمز جلو با کیفیت بالا مناسب ${searchTerm}`
            }
          ];
          setProducts(sampleProducts);
          setFilteredProducts(sampleProducts);
          setBrands(['سایپا', 'ایران خودرو', 'پژو']);
          setCategories(['لنت جلو', 'لنت عقب']);
          setBrakeBrands(['فرودو', 'مترو', 'بوش']);
        }
      } catch (error) {
        console.error('Error:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchProducts();
    }
  }, [searchTerm]);

  // تابع تنظیم خودکار فیلترها بر اساس کلمه جستجو
  const autoSetFilters = (searchQuery, searchResults) => {
    // بررسی اینکه آیا کلمه جستجو یک برند ماشین است
    const foundBrand = brands.find(brand => 
      brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.toLowerCase().includes(brand.toLowerCase())
    );

    // بررسی اینکه آیا کلمه جستجو یک دسته‌بندی است
    const foundCategory = categories.find(category => 
      category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.toLowerCase().includes(category.toLowerCase())
    );

    // بررسی اینکه آیا کلمه جستجو یک برند لنت است
    const foundBrakeBrand = brakeBrands.find(brakeBrand => 
      brakeBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.toLowerCase().includes(brakeBrand.toLowerCase())
    );

    // تنظیم فیلترها بر اساس یافته‌ها
    if (foundBrand) {
      setSelectedBrand(foundBrand);
      console.log(`فیلتر برند ماشین به صورت خودکار روی "${foundBrand}" تنظیم شد`);
    }

    if (foundCategory) {
      setSelectedCategory(foundCategory);
      console.log(`فیلتر دسته‌بندی به صورت خودکار روی "${foundCategory}" تنظیم شد`);
    }

    if (foundBrakeBrand) {
      setSelectedBrakeBrand(foundBrakeBrand);
      console.log(`فیلتر برند لنت به صورت خودکار روی "${foundBrakeBrand}" تنظیم شد`);
    }

    // اگر هیچ فیلتر خودکاری پیدا نشد، پیام نمایش بده
    if (!foundBrand && !foundCategory && !foundBrakeBrand) {
      console.log(`هیچ فیلتر خودکاری برای "${searchQuery}" پیدا نشد. همه محصولات نمایش داده می‌شود.`);
    }
  };

  // فیلتر کردن محصولات
  useEffect(() => {
    let filtered = [...products];

    // فیلتر ترکیبی: محصول باید با همه فیلترهای انتخاب شده مطابقت داشته باشد
    filtered = filtered.filter(product => {
      // فیلتر بر اساس برند ماشین
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }
      
      // فیلتر بر اساس دسته‌بندی
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      
      // فیلتر بر اساس برند لنت
      if (selectedBrakeBrand !== 'all' && 
          product.brakeBrand !== selectedBrakeBrand && 
          product.padbrand !== selectedBrakeBrand) {
        return false;
      }
      
      // اگر همه فیلترها را پاس کرد، محصول را نگه دار
      return true;
    });

    // مرتب‌سازی
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'fa');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedBrand, selectedCategory, selectedBrakeBrand, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال جستجو...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="text-blue-600 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-900">
              نتایج جستجو برای "{searchTerm}"
            </h1>
          </div>
          <p className="text-gray-600 mb-3">
            {filteredProducts.length} محصول یافت شد
          </p>
          
          {/* نمایش فیلترهای فعال */}
          {(selectedBrand !== 'all' || selectedCategory !== 'all' || selectedBrakeBrand !== 'all') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800 mb-2">
                <strong>فیلترهای فعال:</strong>
                {searchTerm && (
                  <span className="text-xs text-blue-600 mr-2">
                    (بر اساس جستجوی "{searchTerm}")
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedBrand !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    برند ماشین: {selectedBrand}
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    دسته: {selectedCategory}
                  </span>
                )}
                {selectedBrakeBrand !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                    برند لنت: {selectedBrakeBrand}
                  </span>
                )}
              </div>
              <div className="text-xs text-blue-600 mt-2">
                فقط محصولاتی نمایش داده می‌شوند که با <strong>همه</strong> فیلترهای انتخاب شده مطابقت داشته باشند
              </div>
              {searchTerm && (
                <div className="text-xs text-green-600 mt-2">
                  <strong>نکته:</strong> فیلترها بر اساس کلمه جستجو به صورت خودکار تنظیم شده‌اند
                </div>
              )}
            </div>
          )}

          {/* نمایش اطلاعات دیباگ برای توسعه‌دهندگان */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
              <div className="text-sm text-gray-700 mb-2">
                <strong>🔍 اطلاعات دیباگ:</strong>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>کلمه جستجو: "{searchTerm}"</div>
                <div>تعداد کل نتایج: {products.length}</div>
                <div>برندهای موجود: {brands.join(', ') || 'هیچ‌کدام'}</div>
                <div>دسته‌های موجود: {categories.join(', ') || 'هیچ‌کدام'}</div>
                <div>برندهای لنت موجود: {brakeBrands.join(', ') || 'هیچ‌کدام'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* فیلتر برند ماشین */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FilterListIcon className="inline mr-1" />
                برند ماشین
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">همه برندها</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* فیلتر برند لنت */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FilterListIcon className="inline mr-1" />
                برند لنت
              </label>
              <select
                value={selectedBrakeBrand}
                onChange={(e) => setSelectedBrakeBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">همه برندهای لنت</option>
                {brakeBrands.map(brakeBrand => (
                  <option key={brakeBrand} value={brakeBrand}>{brakeBrand}</option>
                ))}
              </select>
            </div>

            {/* فیلتر دسته‌بندی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FilterListIcon className="inline mr-1" />
                دسته‌بندی
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">همه دسته‌ها</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* مرتب‌سازی */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SortIcon className="inline mr-1" />
                مرتب‌سازی
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">بر اساس نام</option>
                <option value="price-low">قیمت: کم به زیاد</option>
                <option value="price-high">قیمت: زیاد به کم</option>
              </select>
            </div>

            {/* تعداد نتایج */}
            <div className="flex items-end">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                <span className="font-bold">{filteredProducts.length}</span> محصول
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-blue-200 flex flex-col"
              >
                {/* Product Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <div className="text-4xl mb-2">🚗</div>
                      <div className="text-sm">بدون تصویر</div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4 flex-grow">
                    {product.brand && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">برند ماشین:</span> {product.brand}
                      </div>
                    )}
                    {product.brakeBrand && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">برند لنت:</span> {product.brakeBrand}
                      </div>
                    )}
                    {product.category && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">دسته:</span> {product.category}
                      </div>
                    )}
                  </div>

                  {product.price && (
                    <div className="text-lg font-bold text-green-600 mb-4 text-center">
                      {formatPrice(product.price)} تومان
                    </div>
                  )}

                  {/* دکمه‌های عملیات */}
                  <div className="space-y-2 mt-auto">
                    {/* دکمه مشاهده جزئیات */}
                    <Link
                      to={`/product/${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg"
                    >
                      <VisibilityIcon className="text-sm" />
                      مشاهده جزئیات
                    </Link>
                    
                    {/* دکمه افزودن به سبد خرید */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={addingToCart[product.id]}
                      className={`w-full py-2 px-4 rounded-lg text-center font-medium transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg ${
                        addedToCart[product.id]
                          ? 'bg-green-500 text-white cursor-default'
                          : addingToCart[product.id]
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <AddShoppingCartIcon className="text-sm" />
                      {addedToCart[product.id] 
                        ? '✓ اضافه شد' 
                        : addingToCart[product.id] 
                        ? 'در حال افزودن...' 
                        : 'افزودن به سبد'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">محصولی یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              با فیلترهای انتخاب شده محصولی یافت نشد. لطفاً فیلترها را تغییر دهید.
            </p>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setSelectedCategory('all');
                setSelectedBrakeBrand('all');
                setSortBy('name');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
