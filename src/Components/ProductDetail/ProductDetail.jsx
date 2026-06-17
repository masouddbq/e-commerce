import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import ReviewSection from '../Common/ReviewSection';
import ProductSpecifications from '../Common/ProductSpecifications';
import ProductFeatures from '../Common/ProductFeatures';
import ProductBreadcrumbs from '../Common/ProductBreadcrumbs';
import { supabase } from '../../lib/supabase';
import { useCart } from '../Common/CartContext';
import { formatPriceWithUnit } from '../../lib/utils';
import Button from '../Common/Button';

const ProductDetail = () => {
  const { productId, brand } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentMainImage, setCurrentMainImage] = useState(null);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
  const { addToCart, openCart } = useCart();

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
        console.log('Gallery images count:', data.gallery_images ? data.gallery_images.length : 0);
        if (data.gallery_images && data.gallery_images.length > 0) {
          console.log('Gallery images URLs:', data.gallery_images);
        }
        
        // اطمینان از وجود تمام فیلدهای مورد نیاز
        const normalizedProduct = normalizeProductData(data);
        setProduct(normalizedProduct);
        
        // تنظیم عکس‌های اولیه
        setCurrentMainImage(normalizedProduct.image);
        setCurrentGalleryImages(normalizedProduct.gallery_images || []);
        
        console.log('Normalized product:', normalizedProduct);
        console.log('Normalized gallery images:', normalizedProduct.gallery_images);
        console.log('Current main image set to:', normalizedProduct.image);
        console.log('Current gallery images set to:', normalizedProduct.gallery_images);
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
      gallery_images: productData.gallery_images || [],
      brand: productData.brand || 'برند',
      padBrand: productData.padbrand || productData.padBrand || null,
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
    if (!product) return;
    
    console.log('Product data before adding to cart:', product);
    
    // اطمینان از وجود قیمت معتبر - اولویت با قیمت فعلی
    let productPrice = 0;
    if (product.price && product.price !== '0' && product.price !== 0) {
      productPrice = product.price;
    } else if (product.originalPrice && product.originalPrice !== '0' && product.originalPrice !== 0) {
      productPrice = product.originalPrice;
    } else if (product.currentPrice && product.currentPrice !== '0' && product.currentPrice !== 0) {
      productPrice = product.currentPrice;
    }
    
    console.log('Price selection for cart:', {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      currentPrice: product.currentPrice,
      selectedPrice: productPrice
    });
    
    if (!productPrice || productPrice === '0' || productPrice === 0) {
      console.error('No valid price found for product:', product);
      alert('قیمت محصول نامشخص است. لطفاً با پشتیبانی تماس بگیرید.');
      return;
    }
    
    const productForCart = { 
      id: product.id, 
      name: product.name, 
      image: currentMainImage || product.image, 
      price: productPrice,
      originalPrice: product.originalPrice,
      currentPrice: product.currentPrice
    };
    
    addToCart(productForCart, quantity);
    openCart();
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockCount || 1)) {
      setQuantity(newQuantity);
    }
  };


  // تابع تعویض عکس اصلی با عکس گالری
  const handleImageSwap = (galleryImageIndex) => {
    if (!currentGalleryImages || currentGalleryImages.length === 0) return;
    
    const clickedImage = currentGalleryImages[galleryImageIndex];
    const oldMainImage = currentMainImage;
    
    // تعویض عکس‌ها
    setCurrentMainImage(clickedImage);
    
    // ایجاد آرایه جدید گالری با عکس اصلی قبلی
    const newGalleryImages = [...currentGalleryImages];
    newGalleryImages[galleryImageIndex] = oldMainImage;
    setCurrentGalleryImages(newGalleryImages);
    
    console.log('Image swap:', {
      oldMain: oldMainImage,
      newMain: clickedImage,
      galleryImages: newGalleryImages
    });
    
    // نمایش پیام موفقیت
    console.log(`عکس ${galleryImageIndex + 1} با عکس اصلی جایگزین شد!`);
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
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="md"
              icon={HomeIcon}
            >
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // محاسبه درصد تخفیف
  const discountPercentage = product.originalPrice && product.originalPrice !== product.price 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  // تولید URL کانونیکال برای محصول
  const productUrl = `https://lent-shop.ir/product/${brand || product.brand?.toLowerCase()}/${product.id}`;

  // تبدیل قیمت‌ها به عدد (حذف کاما و کاراکترهای غیر عددی)
  const cleanPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/[^\d]/g, '');
  };

  const productPrice = cleanPrice(product.price || '0');
  const productOldPrice = cleanPrice(product.originalPrice || product.price || '0');
  
  // تعیین وضعیت موجودی
  const stockStatus = product.stockStatus === 'موجود' || (product.stockCount && product.stockCount > 0) 
    ? 'instock' 
    : 'outofstock';
  
  // دریافت URL کامل تصویر محصول
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `https://lent-shop.ir${product.image}`)
    : 'https://lent-shop.ir/favicon.svg';
  
  // دریافت گارانتی از specifications
  const guarantee = product.specifications?.warranty || product.specifications?.guarantee || '';

  return (
    <>
      <Helmet>
        <title>{product.name} | {product.brand} | لنت شاپ</title>
        <meta name="description" content={`${product.name} - خرید لنت ترمز ${product.brand} با کیفیت عالی. قیمت: ${formatPriceWithUnit(product.price)}. ${product.description || 'محصول با کیفیت و دوام بالا'}`} />
        <meta name="keywords" content={`لنت ${product.brand}, ${product.name}, لنت ترمز ${product.brand}, ${product.category}, لنت شاپ`} />
        <meta property="og:title" content={`${product.name} | ${product.brand} | لنت شاپ`} />
        <meta property="og:description" content={`${product.name} - قیمت: ${formatPriceWithUnit(product.price)}. ${product.description || 'محصول با کیفیت و دوام بالا'}`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        {product.image && <meta property="og:image" content={imageUrl} />}
        <link rel="canonical" href={productUrl} />
        
        {/* Torob Meta Tags */}
        <meta name="product_id" content={product.id} />
        <meta name="product_name" content={product.name || ''} />
        <meta property="og:image" content={imageUrl} />
        <meta name="product_price" content={productPrice} />
        <meta name="product_old_price" content={productOldPrice} />
        <meta name="availability" content={stockStatus} />
        {guarantee && <meta name="guarantee" content={guarantee} />}
      </Helmet>
      <div className="min-h-screen py-8">
      {/* Breadcrumbs */}
      <ProductBreadcrumbs 
        productName={product.name}
        brandName={product.brand}
        categoryName={product.category}
      />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="flex w-full items-center justify-between mb-4 sm:mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2"
          >
            <ArrowBackIcon />
            <span className="text-sm hidden sm:inline">بازگشت</span>
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-800 text-right">جزئیات محصول</h1>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-16 mb-2">
          
          {/* Left Column - Product Info & Purchase */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-4">
            {/* Product Title */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">{product.name}</h2>
              <div className="flex items-center gap-3">
                <p className="text-gray-600 text-base">{product.category}</p>
                {product.padBrand && (
                  <span className="text-pink-600 text-sm font-semibold">{product.padBrand}</span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">قیمت</h3>
              <div className="space-y-3 sm:space-y-4">
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
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">موجودی و تعداد</h3>
              <div className="space-y-3 sm:space-y-4">
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
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <Button 
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                fullWidth
                icon={ShoppingCartIcon}
                className="shadow-lg"
              >
                افزودن به سبد خرید
              </Button>
            </div>

            {/* Suitable For */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">مناسب برای خودروهای</h3>
              <p className="text-gray-600 text-base leading-relaxed text-right">{product.suitableFor}</p>
            </div>
          </div>

          {/* Right Column - Product Images */}
          <div className="space-y-6 lg:space-y-2 md:grid md:grid-cols-2 md:gap-x-8 md:p-8 justify-center items-center lg:grid-cols-2 lg:p-2 xl:p-0 xl:flex xl:flex-col">
            {/* Main Product Image */}
            <div className="bg-white rounded-xl p-8 lg:p-[6rem] w-full shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">تصویر محصول</h3>
              <div className="bg-gray-200 rounded-lg md:h-[18rem] md:w-[17rem] lg:w-[20rem] lg:h-[19rem] xl:w-[24rem] xl:h-96 flex items-center justify-center overflow-hidden group">
                {currentMainImage ? (
                  <img 
                    src={currentMainImage} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onClick={() => {
                      // در موبایل، تصویر را در حالت تمام صفحه نمایش بده
                      if (window.innerWidth < 768) {
                        const img = e.target;
                        if (img.requestFullscreen) {
                          img.requestFullscreen();
                        } else if (img.webkitRequestFullscreen) {
                          img.webkitRequestFullscreen();
                        } else if (img.msRequestFullscreen) {
                          img.msRequestFullscreen();
                        }
                      }
                    }}
                  />
                ) : null}
                <div className="text-gray-500 text-center" style={{ display: currentMainImage ? 'none' : 'block' }}>
                  <p className="text-base">تصویر {product.name}</p>
                </div>
                
                {/* راهنمای zoom در موبایل */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:hidden">
                  برای بزرگنمایی کلیک کنید
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="bg-white rounded-xl p-4 md:-translate-y-4 lg:-translate-y-0 sm:p-6 lg:py-4 w-full xl:h-[40vh] xl:w-[43.5vw] shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-8 text-right">گالری تصاویر</h3>
              <div className="grid grid-cols-4 md:flex md:flex-col xl:grid xl:grid-cols-4 gap-2 sm:gap-3 xl:gap-1">
                {currentGalleryImages && currentGalleryImages.length > 0 ? (
                  // نمایش عکس‌های گالری موجود
                  currentGalleryImages.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-200 rounded-lg h-16 sm:h-20 xl:h-24 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden relative group"
                      onClick={() => handleImageSwap(index)}
                      title="کلیک کنید تا با عکس اصلی جایگزین شود"
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${product.name} - تصویر ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <span className="text-gray-500 text-xs" style={{ display: 'none' }}>تصویر {index + 1}</span>
                      
                      {/* نشانگر کلیک */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-semibold">
                          کلیک کنید
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // نمایش placeholder ها اگر عکس گالری وجود نداشته باشد
                  [1, 2, 3, 4].map((index) => (
                    <div key={index} className="bg-gray-200 rounded-lg h-16 sm:h-20 xl:h-24 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                      <span className="text-gray-500 text-xs">تصویر {index}</span>
                    </div>
                  ))
                )}
              </div>
              
              {/* نمایش تعداد عکس‌های گالری */}
              {currentGalleryImages && currentGalleryImages.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {currentGalleryImages.length} عکس در گالری
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Description & Features */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-16 mb-8 sm:mb-12">
          {/* Right Column - Product Description & Features */}
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 xl:p-10 shadow-lg">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 text-right">توضیحات محصول</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-4 sm:mb-6 text-right">{product.description}</p>
            
            <h3 className="text-lg lg:text-xl font-bold text-blue-800 mb-3 sm:mb-4 text-right">ویژگی‌های کلیدی:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-right">
                  <span className="text-blue-500 text-base">•</span>
                  <span className="text-gray-700 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Left Column - Technical Specifications */}
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 xl:p-10 shadow-lg">
            <h2 className="text-xl lg:text-2xl font-bold text-blue-800 mb-4 sm:mb-6 text-right">مشخصات فنی</h2>
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
        {product && product.id && (
          <ReviewSection 
            productId={product.id}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetail;
