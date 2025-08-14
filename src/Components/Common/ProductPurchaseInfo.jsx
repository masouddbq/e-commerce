import React, { useState } from 'react';

const ProductPurchaseInfo = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const calculateDiscount = () => {
    if (!product.originalPrice || product.originalPrice === product.price) return 0;
    const original = parseInt(product.originalPrice.replace(/,/g, ''));
    const current = parseInt(product.price.replace(/,/g, ''));
    return Math.round(((original - current) / original) * 100);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <div className="space-y-6">
      {/* نام و برند */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
        <div className="flex items-center gap-4">
          <span className="text-blue-600 font-semibold">{product.brand}</span>
          <span className="text-gray-600">{product.category}</span>
        </div>
      </div>

      {/* قیمت */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-bold text-blue-600">{product.price} تومان</span>
          {product.originalPrice && product.originalPrice !== product.price && (
            <>
              <span className="text-xl text-gray-400 line-through">{product.originalPrice} تومان</span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                {calculateDiscount()}% تخفیف
              </span>
            </>
          )}
        </div>
        
        {/* موجودی */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">موجودی:</span>
          <span className={`font-semibold ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stockCount > 0 ? `${product.stockCount} عدد` : 'ناموجود'}
          </span>
        </div>

        {/* تعداد */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-600">تعداد:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* دکمه خرید */}
        <button 
          onClick={handleAddToCart}
          disabled={product.stockCount === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 font-semibold text-lg"
        >
          {product.stockCount > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
        </button>
      </div>

      {/* مناسب برای */}
      {product.suitableFor && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">مناسب برای خودروهای:</h3>
          <p className="text-gray-700">{product.suitableFor}</p>
        </div>
      )}
    </div>
  );
};

export default ProductPurchaseInfo;
