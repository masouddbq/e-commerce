import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const PopularProducts = () => {
  const products = [
    {
      id: 1,
      name: "لنت جلو سایپا 131",
      price: "450,000",
      originalPrice: "520,000",
      discount: "15%",
      image: "/saipa.png",
      isNew: true,
      isOnSale: true,
      rating: 4.5,
      reviews: 12
    },
    {
      id: 2,
      name: "لنت عقب پژو 206",
      price: "380,000",
      originalPrice: "420,000",
      discount: "10%",
      image: "/peugeot.png",
      isNew: false,
      isOnSale: true,
      rating: 4.2,
      reviews: 8
    },
    {
      id: 3,
      name: "لنت جلو تویوتا کمری",
      price: "680,000",
      originalPrice: "680,000",
      discount: "0%",
      image: "/toyota.png",
      isNew: true,
      isOnSale: false,
      rating: 4.8,
      reviews: 25
    },
    {
      id: 4,
      name: "لنت عقب هیوندای آوانته",
      price: "420,000",
      originalPrice: "480,000",
      discount: "12%",
      image: "/hyun.png",
      isNew: false,
      isOnSale: true,
      rating: 4.3,
      reviews: 15
    }
  ];

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">محصولات محبوب</h2>
          <p className="text-gray-600">بهترین لنت‌های خودرو با کیفیت تضمینی</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-contain p-4 bg-gray-100"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">جدید</span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">تخفیف</span>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                    <FavoriteIcon className="text-gray-600 text-sm" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors">
                    <CompareArrowsIcon className="text-gray-600 text-sm" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors">
                    <VisibilityIcon className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">{product.name}</h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 mr-2">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {product.isOnSale ? (
                      <>
                        <span className="text-lg font-bold text-red-600">{product.price} تومان</span>
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-800">{product.price} تومان</span>
                    )}
                  </div>
                  {product.isOnSale && (
                    <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="font-bold">{product.discount}</span>
                      <span>تخفیف</span>
                    </span>
                  )}
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-auto">
                  <ShoppingCartIcon className="text-sm" />
                  افزودن به سبد خرید
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            مشاهده همه محصولات
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;
