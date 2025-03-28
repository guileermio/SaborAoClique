import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Produtos" onPress={() => navigation.navigate('Products')} />
      <Button title="Categorias" onPress={() => navigation.navigate('Categories')} />
      <Button title="Carrinho" onPress={() => navigation.navigate('Cart')} />
      <Button title="Histórico de Pedidos" onPress={() => navigation.navigate('Orders')} />
      <Button title="Mais Vendidos" onPress={() => navigation.navigate('Additional')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  }
});

export default HomeScreen;
