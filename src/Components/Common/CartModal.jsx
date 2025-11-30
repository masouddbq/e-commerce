import React from 'react';
import { useCart } from './CartContext';
import Button from './Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const formatCurrency = (num) => {
  if (!num || num === 0) return 'نامشخص';
  return new Intl.NumberFormat('fa-IR').format(Math.round(num));
};

const CartModal = () => {
  const { isOpen, closeCart, items, increment, decrement, removeFromCart, totalCount, totalPrice, clearCart } = useCart();
  
  // نمایش اطلاعات دیباگ در کنسول
  React.useEffect(() => {
    if (isOpen && items.length > 0) {
      console.log('Cart items:', items);
      console.log('Total price:', totalPrice);
      console.log('Items with prices:', items.map(item => ({
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total: item.unitPrice * item.quantity
      })));
    }
  }, [isOpen, items, totalPrice]);
  
  const handleContinue = () => {
    closeCart();
    window.location.href = '/checkout';
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isOpen ? 'bg-black/40 opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
      />

      {/* Glass modal */}
      <div
        className={`absolute left-1/2 top-1/2 w-[95%] sm:w-[560px] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="backdrop-blur-md bg-white/60 border border-white/40 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/50">
            <h3 className="text-gray-800 font-bold text-lg">سبد خرید</h3>
            <button onClick={closeCart} className="text-gray-600 hover:text-gray-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">×</button>
          </div>

          {/* Items */}
          <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center text-gray-600 py-8">
                <div className="text-4xl mb-2">🛒</div>
                <div className="text-sm">سبد خرید شما خالی است</div>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="bg-white/70 rounded-xl p-3 border border-white/50">
                  {/* Mobile Layout - Stacked */}
                  <div className="sm:hidden space-y-3">
                    {/* Product Info Row */}
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name || 'محصول'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 text-xs">بدون تصویر</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 leading-tight mb-1">
                          {item.name && item.name.length > 30 ? `${item.name.substring(0, 30)}...` : (item.name || 'محصول')}
                        </div>
                        <div className="text-xs text-gray-600">
                          قیمت واحد: {item.unitPrice > 0 ? formatCurrency(item.unitPrice) : 'نامشخص'} تومان
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity and Price Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => decrement(item.id)} className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold">-</button>
                        <span className="w-10 text-center text-gray-800 font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => increment(item.id)} className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold">+</button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">جمع:</div>
                        <div className="text-lg font-bold text-blue-600">
                          {item.unitPrice > 0 ? formatCurrency(item.unitPrice * item.quantity) : 'قیمت نامشخص'} تومان
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button Row */}
                    <div className="flex justify-end">
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
                      >
                        <DeleteIcon className="w-4 h-4" />
                        حذف از سبد
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout - Horizontal */}
                  <div className="hidden sm:flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name || 'محصول'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs">بدون تصویر</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{item.name || 'محصول'}</div>
                      <div className="text-xs text-gray-600 mt-1">قیمت واحد: {item.unitPrice > 0 ? formatCurrency(item.unitPrice) : 'نامشخص'} تومان</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decrement(item.id)} className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">-</button>
                    <span className="w-8 text-center text-gray-800 font-semibold">{item.quantity}</span>
                    <button onClick={() => increment(item.id)} className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">+</button>
                  </div>
                  <div className="w-24 text-left text-gray-800 font-bold">
                      {item.unitPrice > 0 ? formatCurrency(item.unitPrice * item.quantity) : 'نامشخص'}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-700 text-sm">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-3 sm:px-4 py-3 bg-white/60 border-t border-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="text-gray-700 text-sm">تعداد اقلام: <span className="font-bold">{totalCount}</span></div>
              <div className="text-gray-900 font-bold text-lg">
                جمع کل: {totalPrice > 0 ? formatCurrency(totalPrice) : 'نامشخص'} تومان
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button onClick={clearCart} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">پاک کردن سبد</button>
              <Button 
                onClick={handleContinue}
                variant="primary"
                size="md"
                fullWidth
                icon={ShoppingCartCheckoutIcon}
                className="sm:flex-1 shadow-lg"
              >
                ادامه فرآیند خرید
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;


