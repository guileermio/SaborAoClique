import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initDB } from './src/database/Database';


export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
