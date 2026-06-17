import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { supabase } from '../../lib/supabase';

const QuickSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [productResults, setProductResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const searchRef = useRef(null);
  const helpRef = useRef(null);

  // بستن مودال راهنما هنگام کلیک خارج از آن
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isHelpModalOpen && helpRef.current && !helpRef.current.contains(event.target)) {
        setIsHelpModalOpen(false);
      }
    };

    if (isHelpModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isHelpModalOpen]);

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
    
    // وانت و پیکاپ
    { id: 33, name: "نیسان دیزل", category: "وانت", link: "/pickup/nissan-diesel" },
    { id: 34, name: "نیسان ناوارا", category: "وانت", link: "/pickup/nissan-navara" },
    { id: 35, name: "تویوتا هیلوکس", category: "وانت", link: "/pickup/toyota-hilux" },
    { id: 36, name: "تویوتا لندکروزر", category: "وانت", link: "/pickup/toyota-landcruiser" },
    { id: 37, name: "میتسوبیشی L200", category: "وانت", link: "/pickup/mitsubishi-l200" },
    { id: 38, name: "فورد رنجر", category: "وانت", link: "/pickup/ford-ranger" },
    { id: 39, name: "ایسوزو D-Max", category: "وانت", link: "/pickup/isuzu-dmax" },
    { id: 40, name: "مازدا BT-50", category: "وانت", link: "/pickup/mazda-bt50" }
  ];

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

  // جستجوی محصولات واقعی بر اساس متن ورودی (debounced)
  useEffect(() => {
    const term = (searchTerm || '').trim();
    if (term === '') {
      setProductResults([]);
      setShowResults(false);
      setSearchLoading(false);
      return;
    }
    let isCancelled = false;
    setSearchLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        if (supabase) {
          // تقسیم کلمات جستجو به کلمات جداگانه
          const searchWords = term.split(/\s+/).filter(word => word.length > 0);
          
          // ساخت query برای جستجوی هوشمند
          // برای هر کلمه، در تمام فیلدها جستجو می‌کنیم
          const { data, error } = await supabase
            .from('products')
            .select('id,name,brand,image,category,vehicleType,price,suitableFor,description');
          
          if (!isCancelled) {
            if (error) {
              setProductResults([]);
              setShowResults(false);
            } else {
              // فیلتر کردن نتایج بر اساس همه کلمات (هر کلمه باید در یکی از فیلدها باشه)
              const filtered = (data || []).filter(product => {
                // برای هر محصول، تمام فیلدهای قابل جستجو رو در یک رشته جمع می‌کنیم
                const searchableText = [
                  product.name,
                  product.brand,
                  product.category,
                  product.suitableFor,
                  product.description
                ].filter(Boolean).join(' ').toLowerCase();
                
                // بررسی اینکه آیا همه کلمات جستجو در متن قابل جستجو وجود دارند
                return searchWords.every(word => 
                  searchableText.includes(word.toLowerCase())
                );
              });
              
              // محدود کردن نتایج به 10 مورد
              const limitedResults = filtered.slice(0, 10);
              
              setProductResults(limitedResults);
              setShowResults(limitedResults.length > 0);
            }
          }
        } else {
          // اگر Supabase در دسترس نیست، از لیست محلی استفاده کن
          const searchWords = term.split(/\s+/).filter(word => word.length > 0);
          const filteredCars = allCars.filter(car => {
            const searchableText = `${car.name} ${car.category}`.toLowerCase();
            return searchWords.every(word => 
              searchableText.includes(word.toLowerCase())
            );
          });
          setProductResults(filteredCars);
          setShowResults(filteredCars.length > 0);
        }
      } catch (e) {
        if (!isCancelled) {
          setProductResults([]);
          setShowResults(false);
        }
      } finally {
        if (!isCancelled) setSearchLoading(false);
      }
    }, 150);
    return () => { isCancelled = true; clearTimeout(timeoutId); };
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
    if (searchTerm.trim()) setShowResults(true);
  };

  const handleCarSelect = (car) => {
    setSearchTerm(car.name);
    setShowResults(false);
    // می‌تونید کاربر رو به صفحه محصول هدایت کنید
    // window.location.href = car.link;
  };

  const handleClose = () => {
    setSearchTerm('');
    setShowResults(false);
    setProductResults([]);
    onClose();
  };

  // غیرفعال کردن اسکرول صفحه اصلی هنگام باز بودن مودال
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">جستجوی سریع محصولات</h2>
            <div className="relative flex-shrink-0" ref={helpRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHelpModalOpen(!isHelpModalOpen);
                }}
                onMouseEnter={() => setIsHelpModalOpen(true)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-300"
                aria-label="راهنما"
              >
                <HelpOutlineIcon className="text-lg" />
              </button>
              {/* Help Modal - Tooltip */}
              {isHelpModalOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-white text-gray-800 rounded-lg shadow-xl p-4 text-sm z-50 border border-gray-200"
                  onMouseEnter={() => setIsHelpModalOpen(true)}
                  onMouseLeave={() => setIsHelpModalOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-right leading-relaxed">
                    توجه کنید که در جستجو هر کلمه محصولات مشابه قابل استفاده نسبت به محصول شما هم نمایش داده خواهد شد
                  </p>
                  <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white"></div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 relative" ref={searchRef}>
            <input 
              className="border w-full max-w-[400px] text-center outline-none border-gray-300 rounded-md shadow-md shadow-slate-300 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base" 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="نام ماشین، برند یا دسته‌بندی خود را جستجو کنید..."
              autoFocus
            />
            <div className='transition-all duration-300 hover:scale-[1.2]'>
              <ZoomInIcon 
                className='cursor-pointer scale-125 bg-blue-500 text-white rounded-md p-1' 
                onClick={handleSearch}
              />
            </div>

            {/* نتایج جستجو */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50 w-full">
                <div className="p-2">
                  {/* گزینه "همه [نام ماشین] ها" */}
                  {productResults.length > 0 && (
                    <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <Link
                        to={`/search-results/${encodeURIComponent(searchTerm.trim())}`}
                        onClick={() => {
                          setShowResults(false);
                          handleClose();
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                      >
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">همه</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-blue-700 text-sm">
                            همه {searchTerm.trim()} ها
                          </div>
                          <div className="text-xs text-blue-600">
                            لنت‌های مناسب از همه برندها
                          </div>
                        </div>
                        <div className="text-blue-500 text-xs">
                          مشاهده همه →
                        </div>
                      </Link>
                    </div>
                  )}
                  
                  {/* نتایج جستجوی عادی */}
                  {productResults.map((p) => (
                    <Link
                      key={p.id}
                      to={p.link || `/product/${getBrandSlug(p.brand || p.category)}/${p.id}`}
                      onClick={() => {
                        setShowResults(false);
                        handleClose();
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-blue-600">بدون تصویر</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-800 text-sm truncate">{p.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {p.brand || p.category} {p.category && p.brand ? `• ${p.category}` : ''}
                        </div>
                        {p.price && (
                          <div className="text-xs text-green-600 font-semibold">
                            {p.price.toLocaleString()} تومان
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                  {searchLoading && (
                    <div className="p-4 text-center text-gray-500 text-sm">در حال جستجو...</div>
                  )}
                  {!searchLoading && productResults.length === 0 && searchTerm.trim() !== '' && (
                    <div className="p-4 text-center text-gray-500 text-sm">موردی یافت نشد</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 text-center">دسته‌بندی‌های محبوب:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => setSearchTerm('سایپا')}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                سایپا
              </button>
              <button
                onClick={() => setSearchTerm('پژو')}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                پژو
              </button>
              <button
                onClick={() => setSearchTerm('هیوندای')}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                هیوندای
              </button>
              <button
                onClick={() => setSearchTerm('تویوتا')}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                تویوتا
              </button>
              <button
                onClick={() => setSearchTerm('نیسان')}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                نیسان
              </button>
              <button
                onClick={() => setSearchTerm('کیا')}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-blue-300"
              >
                کیا
              </button>
            </div>
            
            {/* Additional Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => setSearchTerm('سواری')}
                className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 border border-blue-200 hover:border-blue-400"
              >
                سواری
              </button>
              <button
                onClick={() => setSearchTerm('شاسی بلند')}
                className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 border border-purple-200 hover:border-purple-400"
              >
                شاسی بلند
              </button>
              <button
                onClick={() => setSearchTerm('وانت')}
                className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 border border-orange-200 hover:border-orange-400"
              >
                وانت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearchModal;
