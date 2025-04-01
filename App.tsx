// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/database/Database';
import { CartProvider } from './src/context/CartContext';
import Header from './src/components/Header';

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <View style={styles.container}>
          {/* Header fixo no topo */}
          <Header />
          {/* Conteúdo das telas – certifique-se de usar o padding adequado */}
          <View style={styles.content}>
            <AppNavigator />
          </View>
        </View>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 0,
  },
});