import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/database/Database';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
