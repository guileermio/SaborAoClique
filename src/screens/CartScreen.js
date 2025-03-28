import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState({});

  // Exemplo de simulação do carrinho usando estado local.
  const addToCart = (product) => {
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

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id]) {
        if (newCart[id].quantity > 1) {
          newCart[id].quantity -= 1;
        } else {
          delete newCart[id];
        }
      }
      return newCart;
    });
  };

  const finalizeOrder = () => {
    if (Object.keys(cart).length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar o pedido.');
      return;
    }
    navigation.navigate('Checkout', { cart });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text>{item.product.name} x {item.quantity}</Text>
      <View style={styles.cartButtons}>
        <Button title="+" onPress={() => addToCart(item.product)} />
        <Button title="-" onPress={() => removeFromCart(item.product.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho</Text>
      <FlatList
        data={Object.values(cart)}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={<Text>Carrinho vazio</Text>}
      />
      <Button title="Finalizar Pedido" onPress={finalizeOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  cartButtons: { flexDirection: 'row' }
});

export default CartScreen;
