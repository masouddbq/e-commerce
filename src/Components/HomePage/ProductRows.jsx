import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../Common/CartContext';
import { supabase } from '../../lib/supabase';

const ProductRows = () => {
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [loading, setLoading] = useState({
    bestseller: true,
    discount: true,
  });

  const { addToCart, openCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // محصولات پرفروش - بر اساس تگ bestseller
      const { data: bestsellerData, error: bestsellerError } = await supabase
        .from('products')
        .select('*')
        .eq('badges->>bestseller', 'true')
        .order('created_at', { ascending: false })
        .limit(4);

      if (!bestsellerError && bestsellerData) {
        setBestsellerProducts(bestsellerData);
      }
      setLoading(prev => ({ ...prev, bestseller: false }));

      // محصولات تخفیف‌دار - بر اساس تگ discount یا originalPrice > price
      // ابتدا همه محصولات با تگ discount یا originalPrice را بگیریم
      const { data: allProducts, error: allError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // بیشتر بگیریم تا فیلتر کنیم

      if (!allError && allProducts) {
        // فیلتر کردن محصولاتی که واقعاً تخفیف دارند
        const realDiscountProducts = allProducts
          .filter(product => {
            // اگر تگ discount دارد
            if (product.badges?.discount === true) return true;
            // اگر originalPrice و price دارد و originalPrice > price
            if (product.originalPrice && product.price) {
              const originalPrice = parseInt(product.originalPrice.toString().replace(/,/g, ''));
              const currentPrice = parseInt(product.price.toString().replace(/,/g, ''));
              if (!isNaN(originalPrice) && !isNaN(currentPrice) && originalPrice > currentPrice) {
                return true;
              }
            }
            return false;
          })
          .slice(0, 4);
        setDiscountProducts(realDiscountProducts);
      }
      setLoading(prev => ({ ...prev, discount: false }));
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading({ new: false, bestseller: false, discount: false });
    }
  };

  const toProduct = (p) => ({ id: p.id, name: p.name, price: p.price, image: p.image });

  const ProductCard = ({ product }) => (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="h-24 sm:h-32 md:h-40 lg:h-64 bg-gray-50 flex items-center justify-center relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs sm:text-sm">بدون تصویر</span>
        )}

        {/* نمایش نشان‌ها */}
        {product.badges && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 flex flex-col gap-0.5 sm:gap-1">
            {product.badges.new && (
              <span className="bg-green-500 text-white text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-md">
                جدید
              </span>
            )}
            {product.badges.bestseller && (
              <span className="bg-orange-500 text-white text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-md">
                پرفروش
              </span>
            )}
            {product.badges.discount && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs md:text-sm px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-md">
                تخفیف
              </span>
            )}
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-800 mb-1.5 sm:mb-2 md:mb-3 text-center line-clamp-2 text-[11px] sm:text-xs md:text-sm lg:text-base">
          {product.name}
        </h3>
        <div className="text-center mb-1.5 sm:mb-2 md:mb-3">
          <span className="text-blue-600 font-extrabold text-xs sm:text-sm md:text-base lg:text-lg">
            {formatPrice(product.price)}تومان
          </span>
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className="text-red-500 line-through text-[10px] sm:text-xs md:text-sm font-semibold mr-1 sm:mr-2 md:mr-3">
              {formatPrice(product.originalPrice)}تومان
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(toProduct(product), 1);
            openCart();
          }}
          className="mt-auto w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-1.5 sm:py-2 md:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base"
        >
          <ShoppingCartIcon className="text-xs sm:text-sm md:text-base" />
          <span className="hidden sm:inline">افزودن به سبد خرید</span>
          <span className="sm:hidden">افزودن</span>
        </button>
      </div>
    </Link>
  );

  const ProductRow = ({ title, description, products, loading: rowLoading, icon: Icon, buttonText, buttonLink }) => {
    if (rowLoading) {
      return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
              <p className="text-gray-600">{description}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-2 sm:p-3 md:p-4 animate-pulse">
                  <div className="h-24 sm:h-32 md:h-40 lg:h-48 bg-gray-200 rounded mb-2 sm:mb-3 md:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1.5 sm:mb-2 w-3/4"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (products.length === 0) {
      return null; // اگر محصولی نبود، نمایش نده
    }

    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            {Icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Icon className="text-blue-600 text-2xl" />
              </div>
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* دکمه مشاهده همه */}
          {buttonText && buttonLink && (
            <div className="text-center mt-8 sm:mt-10">
              <Link 
                to={buttonLink}
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg transform hover:scale-105"
              >
                {buttonText} →
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* محصولات پرفروش */}
      <ProductRow
        title="پرفروش‌ترین‌ها"
        description="محصولات محبوب و پرفروش که مشتریان ما بیشتر خریداری کرده‌اند"
        products={bestsellerProducts}
        loading={loading.bestseller}
        buttonText="مشاهده همه پرفروش‌ها"
        buttonLink="/specials?filter=bestseller"
      />

      {/* محصولات تخفیف‌دار */}
      <ProductRow
        title="تخفیف‌های ویژه"
        description="فرصت‌های طلایی خرید با بهترین قیمت‌ها و تخفیف‌های استثنایی"
        products={discountProducts}
        loading={loading.discount}
        buttonText="مشاهده همه تخفیف‌ها"
        buttonLink="/specials?filter=discount"
      />
    </div>
  );
};

export default ProductRows;
