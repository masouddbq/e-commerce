import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReviewSection from '../Common/ReviewSection';
import ProductSpecifications from '../Common/ProductSpecifications';
import ProductFeatures from '../Common/ProductFeatures';
import { supabase } from '../../lib/supabase';
import { formatPriceWithUnit } from '../../lib/utils';

const ProductDetail = () => {
  const { productId, brand } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  // دریافت اطلاعات محصول از دیتابیس
  useEffect(() => {
    fetchProductDetails();
  }, [productId, brand]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching product:', { productId, brand });

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (supabaseError) {
        console.error('Error fetching product:', supabaseError);
        setError('محصول یافت نشد');
        setProduct(null);
      } else if (data) {
        console.log('Product fetched:', data);
        // اطمینان از وجود تمام فیلدهای مورد نیاز
        const normalizedProduct = normalizeProductData(data);
        setProduct(normalizedProduct);
      } else {
        setError('محصول یافت نشد');
        setProduct(null);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('خطا در دریافت اطلاعات محصول');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // نرمال‌سازی داده‌های محصول برای نمایش یکسان
  const normalizeProductData = (productData) => {
    return {
      id: productData.id || productId,
      name: productData.name || 'نام محصول',
      price: productData.price || '0',
      originalPrice: productData.originalPrice || productData.price || '0',
      image: productData.image || null,
      brand: productData.brand || 'برند',
      category: productData.category || 'دسته‌بندی',
      suitableFor: productData.suitableFor || 'مناسب برای خودروهای مختلف',
      stockStatus: productData.stockStatus || 'موجود',
      stockCount: productData.stockCount || 0,
      description: productData.description || 'محصول با کیفیت بالا و دوام عالی، مناسب برای استفاده در خودروهای مختلف. این محصول با استفاده از مواد مرغوب و تکنولوژی پیشرفته تولید شده است.',
      specifications: productData.specifications || {
        material: 'کامپوزیت آلی پیشرفته',
        thickness: '11.5 میلی‌متر',
        weight: '400 گرم',
        temperature: 'تا 350 درجه سانتیگراد',
        warranty: '15 ماه'
      },
      features: productData.features && productData.features.length > 0 ? productData.features : [
        'مقاوم در برابر حرارت بالا',
        'عملکرد ترمزگیری عالی',
        'دوام طولانی مدت',
        'سازگار با سیستم ترمز ABS',
        'کاهش نویز و لرزش'
      ],
      reviews: productData.reviews && productData.reviews.length > 0 ? productData.reviews : [
        {
          id: 1,
          user: 'کاربر سیستم',
          rating: 5,
          comment: 'کیفیت عالی و عملکرد فوق‌العاده',
          date: new Date().toLocaleDateString('fa-IR')
        }
      ]
    };
  };

  // تبدیل کلیدهای مشخصات فنی از انگلیسی به فارسی
  const translateSpecificationKey = (key) => {
    const translations = {
      'material': 'جنس لنت',
      'thickness': 'ضخامت',
      'weight': 'وزن',
      'temperature': 'دمای مقاوم',
      'warranty': 'گارانتی',
      'dimensions': 'ابعاد',
      'composition': 'ترکیب',
      'performance': 'عملکرد',
      'durability': 'دوام',
      'compatibility': 'سازگاری'
    };
    return translations[key] || key;
  };

  const handleAddToCart = () => {
    console.log(`افزودن ${quantity} عدد ${product?.name} به سبد خرید`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockCount || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    console.log('نظر ارسال شد:', reviewData);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">در حال بارگذاری اطلاعات محصول...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="mb-8">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <ArrowBackIcon className="text-gray-600" />
              </button>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">محصول یافت نشد</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {error || 'محصول مورد نظر شما در سیستم موجود نیست.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  // محاسبه درصد تخفیف
  const discountPercentage = product.originalPrice && product.originalPrice !== product.price 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="flex w-full items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowBackIcon />
            <span className="text-sm">بازگشت</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">جزئیات محصول</h1>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-32 mb-2">
          
          {/* Left Column - Product Info & Purchase */}
          <div className="space-y-6 lg:space-y-4">
            {/* Product Title */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">{product.name}</h2>
              <p className="text-gray-600 text-base">{product.category}</p>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">قیمت</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-base">قیمت فعلی:</span>
                  <span className="text-xl lg:text-xl font-bold text-blue-600">{formatPriceWithUnit(product.price)}</span>
                </div>
                {product.originalPrice && product.originalPrice !== product.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-base">قیمت اصلی:</span>
                    <span className="text-lg text-red-500 line-through">{formatPriceWithUnit(product.originalPrice)}</span>
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-base">تخفیف:</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {discountPercentage}% تخفیف
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock & Quantity */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">موجودی و تعداد</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-base">وضعیت موجودی:</span>
                  <span className="text-green-600 font-semibold text-base">{product.stockStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-base">تعداد موجودی:</span>
                  <span className="text-gray-800 font-semibold text-base">{product.stockCount} عدد</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-base">انتخاب تعداد:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 text-base"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stockCount}
                      className="w-16 text-center border-0 focus:ring-0 text-base font-semibold"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockCount}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold text-base"
              >
                افزودن به سبد خرید
              </button>
            </div>

            {/* Suitable For */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">مناسب برای خودروهای</h3>
              <p className="text-gray-600 text-base leading-relaxed">{product.suitableFor}</p>
            </div>
          </div>

          {/* Right Column - Product Images */}
          <div className="space-y-6 lg:space-y-2">
            {/* Main Product Image */}
            <div className="bg-white rounded-xl p-6 lg:p-2 w-[40vw] shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">تصویر محصول</h3>
              <div className="bg-gray-200 rounded-lg h-80 xl:h-96 flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="text-gray-500 text-center" style={{ display: product.image ? 'none' : 'block' }}>
                  <p className="text-base">تصویر {product.name}</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">گالری تصاویر</h3>
              <div className="grid grid-cols-4 gap-3 xl:gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-20 xl:h-24 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <span className="text-gray-500 text-xs">تصویر {index}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Features */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12">
          {/* Right Column - Product Description & Features */}
          <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-800 mb-6">توضیحات محصول</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-6">{product.description}</p>
            
            <h3 className="text-lg lg:text-xl font-bold text-blue-800 mb-4">ویژگی‌های کلیدی:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 text-base">•</span>
                  <span className="text-gray-700 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Left Column - Technical Specifications */}
          <div className="bg-white rounded-xl p-8 lg:p-10 shadow-lg">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-800 mb-6">مشخصات فنی</h2>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-gray-600 text-base">{translateSpecificationKey(key)}:</span>
                  <span className="text-gray-800 font-semibold text-base">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection 
          productId={product.id}
          reviews={product.reviews}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
