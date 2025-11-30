import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { getBrandImage } from '../../lib/utils';

const PriceEditor = () => {
  const [activeTab, setActiveTab] = useState('brands'); // 'brands' or 'all-products'
  
  // برای تب برندهای خودرو
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceChangePercent, setPriceChangePercent] = useState('');
  const [priceChangeType, setPriceChangeType] = useState('increase'); // 'increase' or 'decrease'
  const [applyToOriginalPrice, setApplyToOriginalPrice] = useState(true);
  const [applyToDiscountedPrice, setApplyToDiscountedPrice] = useState(true);
  
  // برای تب همه محصولات
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [priceChangeAmount, setPriceChangeAmount] = useState('');
  const [priceChangeTypeProducts, setPriceChangeTypeProducts] = useState('set'); // 'set', 'increase', 'decrease'
  const [applyToOriginalPriceProducts, setApplyToOriginalPriceProducts] = useState(true);
  const [applyToDiscountedPriceProducts, setApplyToDiscountedPriceProducts] = useState(true);
  
  // برای جستجو و صفحه‌بندی
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(100);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBrands();
    fetchAllProducts();
  }, []);

  // بارگذاری محصولات هنگام تغییر تب
  useEffect(() => {
    if (activeTab === 'all-products') {
      fetchAllProducts();
    }
  }, [activeTab]);

  // فیلتر کردن محصولات بر اساس جستجو
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1); // بازگشت به صفحه اول هنگام جستجو
  }, [searchTerm, allProducts]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return;
      }

      // دریافت برندها از جدول brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (brandsError) {
        console.error('Error fetching brands:', brandsError);
      }

      let allBrands = brandsData || [];

      // دریافت برندها از محصولات برای اطمینان از نمایش همه برندها
      const { data: productBrands, error: productBrandsError } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .not('brand', 'eq', '');

      if (!productBrandsError && productBrands) {
        const uniqueProductBrands = [...new Set(productBrands.map(p => p.brand))];
        const existingBrandNames = allBrands.map(b => b.name);
        const missingBrands = uniqueProductBrands.filter(brandName => 
          !existingBrandNames.includes(brandName)
        );

        // اضافه کردن برندهای گمشده
        missingBrands.forEach(brandName => {
          allBrands.push({
            id: `product_${brandName}`,
            name: brandName,
            image: getBrandImage(brandName)
          });
        });
      }

      // حذف برندهای تکراری
      const uniqueBrands = [];
      const seenBrands = new Set();

      allBrands.forEach(brand => {
        if (!seenBrands.has(brand.name)) {
          seenBrands.add(brand.name);
          uniqueBrands.push({
            ...brand,
            image: brand.image || getBrandImage(brand.name)
          });
        }
      });

      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setMessage({ type: 'error', text: 'خطا در دریافت برندها' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoadingProducts(true);
      
      if (!supabase) {
        console.warn('Supabase not available');
        return;
      }

      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setMessage({ type: 'error', text: 'خطا در دریافت محصولات: ' + error.message });
        return;
      }

      setAllProducts(products || []);
      setFilteredProducts(products || []);
      setSelectedProducts([]); // پاک کردن انتخاب‌های قبلی
      
      if (!products || products.length === 0) {
        setMessage({ type: 'warning', text: 'هیچ محصولی یافت نشد' });
      } else {
        setMessage({ type: 'success', text: `${products.length} محصول یافت شد` });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'خطا در دریافت محصولات: ' + error.message });
    } finally {
      setLoadingProducts(false);
    }
  };

  // توابع مربوط به مدیریت محصولات
  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAllProducts = () => {
    const currentPageProducts = getCurrentPageProducts();
    
    if (selectedProducts.length === currentPageProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentPageProducts.map(p => p.id));
    }
  };

  // محاسبه محصولات صفحه فعلی
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // محاسبه تعداد صفحات
  const getTotalPages = () => {
    return Math.ceil(filteredProducts.length / productsPerPage);
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandName)) {
        return prev.filter(b => b !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedBrands.length === brands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(brands.map(b => b.name));
    }
  };

  // تابع اعمال تغییرات قیمت برای همه محصولات
  const applyAllProductsPriceChange = async () => {
    if (selectedProducts.length === 0) {
      setMessage({ type: 'error', text: 'لطفاً حداقل یک محصول را انتخاب کنید' });
      return;
    }

    if (!priceChangeAmount || parseFloat(priceChangeAmount) === 0) {
      setMessage({ type: 'error', text: 'لطفاً مبلغ تغییر قیمت را وارد کنید' });
      return;
    }

    if (!applyToOriginalPriceProducts && !applyToDiscountedPriceProducts) {
      setMessage({ type: 'error', text: 'لطفاً حداقل یکی از گزینه‌های قیمت اصلی یا قیمت تخفیف‌خورده را انتخاب کنید' });
      return;
    }

    try {
      setProcessing(true);
      setMessage({ type: '', text: '' });

      const amount = parseFloat(priceChangeAmount);

      // دریافت محصولات انتخاب شده
      const productsToUpdate = allProducts.filter(product => 
        selectedProducts.includes(product.id)
      );

      if (productsToUpdate.length === 0) {
        setMessage({ type: 'warning', text: 'هیچ محصولی برای به‌روزرسانی یافت نشد' });
        setProcessing(false);
        return;
      }

      // به‌روزرسانی قیمت‌ها
      const updatedProducts = productsToUpdate.map(product => {
        const updates = { id: product.id };

        // تبدیل قیمت‌ها از رشته به عدد (حذف کاما و اعداد فارسی)
        const parsePrice = (priceStr) => {
          if (!priceStr) return 0;
          // تبدیل اعداد فارسی به انگلیسی
          const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          let result = priceStr.toString();
          for (let i = 0; i < 10; i++) {
            result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
          }
          // حذف کاما و سایر کاراکترهای غیر عددی
          result = result.replace(/[^0-9]/g, '');
          return parseInt(result) || 0;
        };

        const currentPrice = parsePrice(product.price);
        const currentOriginalPrice = parsePrice(product.originalPrice);

        console.log(`Product: ${product.name}, Current Price: ${currentPrice}, Original Price: ${currentOriginalPrice}`);

        // محاسبه قیمت‌های جدید
        if (applyToDiscountedPriceProducts && currentPrice > 0) {
          let newPrice;
          if (priceChangeTypeProducts === 'set') {
            newPrice = amount;
          } else if (priceChangeTypeProducts === 'increase') {
            newPrice = currentPrice + amount;
          } else { // decrease
            newPrice = Math.max(0, currentPrice - amount);
          }
          updates.price = formatPrice(newPrice);
          console.log(`New Price: ${newPrice} -> ${updates.price}`);
        }

        if (applyToOriginalPriceProducts && currentOriginalPrice > 0) {
          let newOriginalPrice;
          if (priceChangeTypeProducts === 'set') {
            newOriginalPrice = amount;
          } else if (priceChangeTypeProducts === 'increase') {
            newOriginalPrice = currentOriginalPrice + amount;
          } else { // decrease
            newOriginalPrice = Math.max(0, currentOriginalPrice - amount);
          }
          updates.originalPrice = formatPrice(newOriginalPrice);
          console.log(`New Original Price: ${newOriginalPrice} -> ${updates.originalPrice}`);
        }

        return updates;
      });

      // به‌روزرسانی دیتابیس
      let successCount = 0;
      let errorCount = 0;

      for (const update of updatedProducts) {
        const { id, ...updateData } = update;
        
        // حذف فیلدهای خالی
        const cleanUpdateData = {};
        if (updateData.price) cleanUpdateData.price = updateData.price;
        if (updateData.originalPrice) cleanUpdateData.originalPrice = updateData.originalPrice;

        if (Object.keys(cleanUpdateData).length > 0) {
          console.log(`Updating product ${id} with data:`, cleanUpdateData);
          
          const { error } = await supabase
            .from('products')
            .update(cleanUpdateData)
            .eq('id', id);

          if (error) {
            console.error(`Error updating product ${id}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        }
      }

      const changeTypeText = priceChangeTypeProducts === 'set' ? 'تنظیم' : 
                            priceChangeTypeProducts === 'increase' ? 'افزایش' : 'کاهش';
      const priceTypesText = [];
      if (applyToOriginalPriceProducts) priceTypesText.push('قیمت اصلی');
      if (applyToDiscountedPriceProducts) priceTypesText.push('قیمت تخفیف‌خورده');
      
      setMessage({ 
        type: 'success', 
        text: `قیمت ${priceTypesText.join(' و ')} ${successCount} محصول با ${changeTypeText} ${formatPrice(amount)} تومان به‌روزرسانی شد${errorCount > 0 ? ` (${errorCount} خطا)` : ''}` 
      });

      // پاک کردن فرم
      setSelectedProducts([]);
      setPriceChangeAmount('');
      
      // بارگذاری مجدد محصولات
      fetchAllProducts();

    } catch (error) {
      console.error('Error updating product prices:', error);
      setMessage({ type: 'error', text: error.message || 'خطا در به‌روزرسانی قیمت‌ها' });
    } finally {
      setProcessing(false);
    }
  };

  // تابع فرمت کردن قیمت با کاما و اعداد انگلیسی
  const formatPrice = (price) => {
    if (!price || price === 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const applyPriceChange = async () => {
    if (selectedBrands.length === 0) {
      setMessage({ type: 'error', text: 'لطفاً حداقل یک برند را انتخاب کنید' });
      return;
    }

    if (!priceChangePercent || parseFloat(priceChangePercent) === 0) {
      setMessage({ type: 'error', text: 'لطفاً درصد تغییر قیمت را وارد کنید' });
      return;
    }

    if (!applyToOriginalPrice && !applyToDiscountedPrice) {
      setMessage({ type: 'error', text: 'لطفاً حداقل یکی از گزینه‌های قیمت اصلی یا قیمت تخفیف‌خورده را انتخاب کنید' });
      return;
    }

    try {
      setProcessing(true);
      setMessage({ type: '', text: '' });

      const percent = parseFloat(priceChangePercent);
      const multiplier = priceChangeType === 'increase' 
        ? (1 + percent / 100) 
        : (1 - percent / 100);

      // دریافت محصولات برندهای انتخاب شده
      const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .in('brand', selectedBrands);

      if (fetchError) {
        throw new Error('خطا در دریافت محصولات: ' + fetchError.message);
      }

      if (!products || products.length === 0) {
        setMessage({ type: 'warning', text: 'هیچ محصولی برای برندهای انتخابی یافت نشد' });
        setProcessing(false);
        return;
      }

      // به‌روزرسانی قیمت‌ها
      const updatedProducts = products.map(product => {
        const updates = { id: product.id };

        // تبدیل قیمت‌ها از رشته به عدد (حذف کاما و اعداد فارسی)
        const parsePrice = (priceStr) => {
          if (!priceStr) return 0;
          // تبدیل اعداد فارسی به انگلیسی
          const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          let result = priceStr.toString();
          for (let i = 0; i < 10; i++) {
            result = result.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
          }
          // حذف کاما و سایر کاراکترهای غیر عددی
          result = result.replace(/[^0-9]/g, '');
          return parseInt(result) || 0;
        };

        const currentPrice = parsePrice(product.price);
        const currentOriginalPrice = parsePrice(product.originalPrice);

        console.log(`Product: ${product.name}, Current Price: ${currentPrice}, Original Price: ${currentOriginalPrice}`);

        // محاسبه قیمت‌های جدید
        if (applyToDiscountedPrice && currentPrice > 0) {
          const newPrice = Math.round(currentPrice * multiplier);
          updates.price = formatPrice(newPrice);
          console.log(`New Price: ${newPrice} -> ${updates.price}`);
        }

        if (applyToOriginalPrice && currentOriginalPrice > 0) {
          const newOriginalPrice = Math.round(currentOriginalPrice * multiplier);
          updates.originalPrice = formatPrice(newOriginalPrice);
          console.log(`New Original Price: ${newOriginalPrice} -> ${updates.originalPrice}`);
        }

        return updates;
      });

      // به‌روزرسانی دیتابیس
      let successCount = 0;
      let errorCount = 0;

      for (const update of updatedProducts) {
        const { id, ...updateData } = update;
        
        // حذف فیلدهای خالی
        const cleanUpdateData = {};
        if (updateData.price) cleanUpdateData.price = updateData.price;
        if (updateData.originalPrice) cleanUpdateData.originalPrice = updateData.originalPrice;

        if (Object.keys(cleanUpdateData).length > 0) {
          console.log(`Updating product ${id} with data:`, cleanUpdateData);
          
          const { error } = await supabase
            .from('products')
            .update(cleanUpdateData)
            .eq('id', id);

          if (error) {
            console.error(`Error updating product ${id}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        }
      }

      const changeTypeText = priceChangeType === 'increase' ? 'افزایش' : 'کاهش';
      const priceTypesText = [];
      if (applyToOriginalPrice) priceTypesText.push('قیمت اصلی');
      if (applyToDiscountedPrice) priceTypesText.push('قیمت تخفیف‌خورده');
      
      setMessage({ 
        type: 'success', 
        text: `قیمت ${priceTypesText.join(' و ')} ${successCount} محصول با ${changeTypeText} ${percent}٪ به‌روزرسانی شد${errorCount > 0 ? ` (${errorCount} خطا)` : ''}` 
      });

      // پاک کردن فرم
      setSelectedBrands([]);
      setPriceChangePercent('');

    } catch (error) {
      console.error('Error updating prices:', error);
      setMessage({ type: 'error', text: error.message || 'خطا در به‌روزرسانی قیمت‌ها' });
    } finally {
      setProcessing(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">ویرایش قیمت محصولات</h1>

        {/* تب‌ها */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'brands'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            تغییر قیمت بر اساس برند خودرو (درصدی)
          </button>
          <button
            onClick={() => setActiveTab('all-products')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all-products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            تغییر قیمت همه محصولات (مبلغی)
          </button>
        </div>

        {/* پیام‌ها */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* محتوای تب برندهای خودرو */}
        {activeTab === 'brands' && (
          <>
            {/* راهنما */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">راهنما:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• برندهای مورد نظر را با تیک زدن انتخاب کنید</li>
                <li>• نوع تغییر قیمت (افزایش یا کاهش) را مشخص کنید</li>
                <li>• درصد تغییر را وارد کنید</li>
                <li>• انتخاب کنید که تغییرات روی کدام قیمت اعمال شود (قیمت اصلی، تخفیف‌خورده یا هر دو)</li>
                <li>• دکمه "اعمال تغییرات" را بزنید</li>
              </ul>
            </div>

        {/* تنظیمات */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">تنظیمات تغییر قیمت</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* نوع تغییر */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع تغییر:
              </label>
              <select
                value={priceChangeType}
                onChange={(e) => setPriceChangeType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="increase">افزایش قیمت</option>
                <option value="decrease">کاهش قیمت</option>
              </select>
            </div>

            {/* درصد تغییر */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                درصد تغییر:
              </label>
              <input
                type="number"
                value={priceChangePercent}
                onChange={(e) => setPriceChangePercent(e.target.value)}
                placeholder="مثال: 10"
                min="0"
                max="100"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* انتخاب نوع قیمت */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اعمال تغییرات به:
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyToOriginalPrice}
                  onChange={(e) => setApplyToOriginalPrice(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">قیمت اصلی</span>
              </label>
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyToDiscountedPrice}
                  onChange={(e) => setApplyToDiscountedPrice(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">قیمت تخفیف‌خورده</span>
              </label>
            </div>
          </div>
        </div>

        {/* لیست برندها */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">انتخاب برندها:</h3>
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              {selectedBrands.length === brands.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-full mb-2"></div>
                  <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedBrands.includes(brand.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => handleBrandToggle(brand.name)}
                    className="mb-2 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-20 h-20 object-contain rounded-full mb-2"
                    onError={(e) => {
                      e.target.src = '/placeholder-brand.png';
                    }}
                  />
                  <span className="text-sm font-medium text-center">{brand.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* دکمه اعمال تغییرات */}
        <div className="flex justify-center">
          <button
            onClick={applyPriceChange}
            disabled={processing || selectedBrands.length === 0}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
              processing || selectedBrands.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {processing ? (
              <span className="flex items-center space-x-2 space-x-reverse">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>در حال پردازش...</span>
              </span>
            ) : (
              `اعمال تغییرات${selectedBrands.length > 0 ? ` (${selectedBrands.length} برند)` : ''}`
            )}
          </button>
        </div>
          </>
        )}

        {/* محتوای تب همه محصولات */}
        {activeTab === 'all-products' && (
          <>
            {/* راهنما */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">راهنما:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• از جستجو برای پیدا کردن محصولات خاص استفاده کنید</li>
                <li>• محصولات در صفحات 100 تایی نمایش داده می‌شوند</li>
                <li>• نوع تغییر قیمت (تنظیم، افزایش یا کاهش) را مشخص کنید</li>
                <li>• مبلغ تغییر را وارد کنید</li>
                <li>• انتخاب کنید که تغییرات روی کدام قیمت اعمال شود</li>
                <li>• دکمه "اعمال تغییرات" را بزنید</li>
              </ul>
            </div>

            {/* جستجو */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">جستجوی محصولات:</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو بر اساس نام محصول..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  پاک کردن
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {searchTerm ? `${filteredProducts.length} محصول یافت شد` : `${allProducts.length} محصول کل`}
              </div>
            </div>

            {/* تنظیمات تغییر قیمت */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">تنظیمات تغییر قیمت</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* نوع تغییر */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع تغییر:
                  </label>
                  <select
                    value={priceChangeTypeProducts}
                    onChange={(e) => setPriceChangeTypeProducts(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="set">تنظیم قیمت جدید</option>
                    <option value="increase">افزایش قیمت</option>
                    <option value="decrease">کاهش قیمت</option>
                  </select>
                </div>

                {/* مبلغ تغییر */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مبلغ تغییر (تومان):
                  </label>
                  <input
                    type="number"
                    value={priceChangeAmount}
                    onChange={(e) => setPriceChangeAmount(e.target.value)}
                    placeholder="مثال: 100000"
                    min="0"
                    step="1000"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* تعداد محصولات انتخاب شده */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    محصولات انتخاب شده:
                  </label>
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-blue-800 font-bold">
                      {selectedProducts.length} محصول انتخاب شده
                    </span>
                  </div>
                </div>
              </div>

              {/* انتخاب نوع قیمت */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اعمال تغییرات به:
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToOriginalPriceProducts}
                      onChange={(e) => setApplyToOriginalPriceProducts(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">قیمت اصلی</span>
                  </label>
                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyToDiscountedPriceProducts}
                      onChange={(e) => setApplyToDiscountedPriceProducts(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">قیمت تخفیف‌خورده</span>
                  </label>
                </div>
              </div>
            </div>

            {/* لیست محصولات */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">
                  محصولات ({filteredProducts.length} محصول):
                </h3>
                <button
                  onClick={handleSelectAllProducts}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  {selectedProducts.length === getCurrentPageProducts().length ? 'لغو انتخاب همه' : 'انتخاب همه'}
                </button>
              </div>
              
              {loadingProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <div className="w-4 h-4 bg-gray-200 animate-pulse rounded mr-3"></div>
                      <div className="flex-1">
                        <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="w-24 h-3 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {getCurrentPageProducts().map((product) => (
                      <label
                        key={product.id}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedProducts.includes(product.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="mr-3 w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>
                              قیمت فعلی: <span className="font-semibold">{product.price} تومان</span>
                            </div>
                            {product.originalPrice && (
                              <div>
                                قیمت اصلی: <span className="font-semibold">{product.originalPrice} تومان</span>
                              </div>
                            )}
                            {product.brand && (
                              <div>
                                برند: <span className="font-semibold">{product.brand}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* صفحه‌بندی */}
                  {getTotalPages() > 1 && (
                    <div className="mt-4 flex justify-center items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        قبلی
                      </button>
                      
                      <span className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg">
                        صفحه {currentPage} از {getTotalPages()}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
                        disabled={currentPage === getTotalPages()}
                        className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        بعدی
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* دکمه اعمال تغییرات */}
            <div className="flex justify-center">
              <button
                onClick={applyAllProductsPriceChange}
                disabled={processing || selectedProducts.length === 0}
                className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
                  processing || selectedProducts.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {processing ? (
                  <span className="flex items-center space-x-2 space-x-reverse">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال پردازش...</span>
                  </span>
                ) : (
                  `اعمال تغییرات${selectedProducts.length > 0 ? ` (${selectedProducts.length} محصول)` : ''}`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceEditor;

