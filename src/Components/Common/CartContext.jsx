import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'cartItems';

const parsePriceToNumber = (price) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  
  console.log('Parsing price:', price, 'Type:', typeof price);
  
  // حذف کاراکترهای غیر عددی و تبدیل به عدد
  const normalized = String(price).replace(/[^0-9]/g, '');
  const parsed = parseInt(normalized, 10);
  
  console.log('Normalized:', normalized, 'Parsed:', parsed);
  
  // بررسی معتبر بودن عدد
  if (Number.isNaN(parsed) || parsed <= 0) {
    console.warn('Invalid price:', price, 'parsed as:', parsed);
    return 0;
  }
  
  return parsed;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    
    const productId = product.id ?? product.productId;
    if (productId == null) return;
    
    console.log('Raw product data:', product);
    
    // تلاش برای دریافت قیمت از فیلدهای مختلف
    let unitPrice = 0;
    if (product.price) {
      unitPrice = parsePriceToNumber(product.price);
    } else if (product.originalPrice) {
      unitPrice = parsePriceToNumber(product.originalPrice);
    } else if (product.currentPrice) {
      unitPrice = parsePriceToNumber(product.currentPrice);
    }
    
    console.log('Price parsing result:', {
      originalPrice: product.price,
      originalPriceAlt: product.originalPrice,
      currentPrice: product.currentPrice,
      parsedUnitPrice: unitPrice
    });
    
    // بررسی معتبر بودن قیمت
    if (unitPrice <= 0) {
      console.error('Invalid product price:', {
        product,
        parsedPrice: unitPrice,
        originalPrice: product.price,
        originalPriceAlt: product.originalPrice
      });
      return;
    }
    
    console.log('Adding product to cart:', {
      id: productId,
      name: product.name,
      originalPrice: product.price,
      parsedPrice: unitPrice,
      quantity
    });
    
    setItems(prev => {
      const existingIndex = prev.findIndex(p => p.id === productId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.max(1, (updated[existingIndex].quantity || 1) + quantity)
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: productId,
          name: product.name || 'محصول',
          image: product.image || null,
          unitPrice,
          quantity: Math.max(1, quantity)
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const increment = (id) => updateQuantity(id, (items.find(i => i.id === id)?.quantity || 1) + 1);
  const decrement = (id) => updateQuantity(id, (items.find(i => i.id === id)?.quantity || 1) - 1);

  const clearCart = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(v => !v);

  const { totalCount, totalPrice } = useMemo(() => {
    const totals = items.reduce((acc, item) => {
      acc.totalCount += item.quantity || 1;
      acc.totalPrice += (item.unitPrice || 0) * (item.quantity || 1);
      return acc;
    }, { totalCount: 0, totalPrice: 0 });
    return totals;
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    increment,
    decrement,
    clearCart,
    totalCount,
    totalPrice,
    isOpen,
    openCart,
    closeCart,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};


