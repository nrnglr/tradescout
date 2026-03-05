import React, { createContext, useContext, useState, ReactNode } from 'react';

// Sepet öğesi tipi
export interface CartItem {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  period: 'monthly' | 'yearly';
  searchLimit: string;
  features: string[];
}

// Sepet context tipi
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalPrice: number;
  itemCount: number;
  billingPeriod: 'monthly' | 'yearly';
  setBillingPeriod: (period: 'monthly' | 'yearly') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const addToCart = (item: CartItem) => {
    // Aynı paketi tekrar eklemeye çalışırsa, önce kaldır sonra ekle
    setItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [...filtered, { ...item, period: billingPeriod }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const totalPrice = items.reduce((sum, item) => {
    const price = billingPeriod === 'yearly' ? item.yearlyPrice : item.price;
    return sum + price;
  }, 0);

  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalPrice,
        itemCount,
        billingPeriod,
        setBillingPeriod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
