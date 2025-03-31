import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = { 
  product: any; 
  quantity: number;
};
export type CartType = Record<string, CartItem>;

type CartContextType = {
  cart: CartType;
  addToCart: (product: any) => void;
  setCart: React.Dispatch<React.SetStateAction<CartType>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartType>({});

  const addToCart = (product: any) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[product.id]) {
        newCart[product.id].quantity += 1;
      } else {
        newCart[product.id] = { product, quantity: 1 };
      }
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
