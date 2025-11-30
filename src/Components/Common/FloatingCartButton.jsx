import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from './CartContext';

const FloatingCartButton = () => {
  const { toggleCart, isOpen, totalCount } = useCart();
  return (
    <button
      onClick={toggleCart}
      className="fixed left-4 bottom-12 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl rounded-full w-14 h-14 flex items-center justify-center transition-all"
      aria-label="cart"
    >
      <div className="relative">
        {isOpen ? (
          <CloseIcon className="text-blue-700" />
        ) : (
          <ShoppingCartIcon className="text-blue-700" />
        )}
        {totalCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[22px] text-center">
            {totalCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default FloatingCartButton;


