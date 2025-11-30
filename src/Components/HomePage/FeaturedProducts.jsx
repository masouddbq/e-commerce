import React, { useState, useEffect } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../Common/CartContext';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // فقط 4 محصول آخرین که badges گرفته‌اند برای نمایش در صفحه اصلی
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or('badges->>new.eq.true,badges->>bestseller.eq.true,badges->>discount.eq.true')
          .limit(4)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Error fetching featured products:', error);
          setFeaturedProducts([]);
        } else {
          setFeaturedProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const { addToCart, openCart } = useCart();

  const toProduct = (p) => ({ id: p.id, name: p.name, price: p.price, image: p.image });

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
                                   {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-3 sm:p-4 animate-pulse">
                  <div className="h-32 sm:h-40 lg:h-48 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
         ) : featuredProducts.length > 0 ? (
                      <div className="flex flex-col w-[250px] mx-auto sm:grid sm:grid-cols-2 sm:w-[90%] md:grid-cols-3 md:w-[100%] lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
                                       <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 flex flex-col hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="h-[15rem] md:h-60 lg:h-64 bg-gray-50 flex items-center justify-center relative">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="-z-1 h-[100%] w-[100%] sm:h-[15rem] sm:w-[17rem] md:h-[15rem] lg:h-[15rem] xl:h-64 object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm sm:text-base">بدون تصویر</span>
                  )}
                  
                  {/* نمایش نشان‌ها */}
                  {product.badges && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1">
                      {product.badges.new && (
                        <span className="bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-bold shadow-md">
                          جدید
                        </span>
                      )}
                      {product.badges.bestseller && (
                        <span className="bg-orange-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-bold shadow-md">
                          پرفروش
                        </span>
                      )}
                      {product.badges.discount && (
                        <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-bold shadow-md">
                          تخفیف
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 sm:mt-3 text-center line-clamp-2 text-xs sm:text-base lg:text-lg">{product.name}</h3>
                  <div className="text-center mb-2 sm:mb-3">
                    <span className="text-blue-600 font-extrabold text-sm sm:text-base lg:text-lg">{formatPrice(product.price)}تومان</span>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <span className="text-red-500 line-through text-xs sm:text-sm font-semibold mr-2 sm:mr-3">{formatPrice(product.originalPrice)}تومان</span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      addToCart(toProduct(product), 1); 
                      openCart(); 
                    }} 
                    className="mt-auto w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
                  >
                    <ShoppingCartIcon className="text-sm sm:text-base" />
                    افزودن به سبد خرید
                  </button>
                </div>
              </Link>
          ))}
        </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">هیچ محصول ویژه‌ای یافت نشد</p>
          </div>
        )}
        
        {/* دکمه مشاهده همه */}
        <div className="text-center mt-8 sm:mt-10">
          <Link to="/specials" className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl text-base sm:text-lg transform hover:scale-105">
            مشاهده همه محصولات ویژه →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
