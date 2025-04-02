// App.tsx
import React, { useEffect } from 'react';
import { StatusBar, View, StyleSheet, Alert, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/database/Database';
import { CartProvider } from './src/context/CartContext';
import Header from './src/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  useEffect(() => {
    initDB();
    //seedDatabase();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'O app precisa de acesso à galeria!');
      }
    })();
  }, []);

  LogBox.ignoreLogs([
    'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48'
  ]);

  return (
    <CartProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
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
