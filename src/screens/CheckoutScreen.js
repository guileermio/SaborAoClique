import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import db from '../database/Database';

const CheckoutScreen = ({ route, navigation }) => {
  const { cart } = route.params;
  const total = Object.values(cart).reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const orderCode = 'PED' + Date.now();
  const orderDate = new Date().toISOString();

  const completeOrder = () => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO orders (order_code, order_date, total) VALUES (?, ?, ?);`,
        [orderCode, orderDate, total],
        (_, result) => {
          const orderId = result.insertId;
          Object.values(cart).forEach(item => {
            tx.executeSql(
              `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);`,
              [orderId, item.product.id, item.quantity, item.product.price]
            );
          });
        }
      );
    }, (error) => {
      console.log("Erro ao finalizar pedido:", error);
    }, () => {
      Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
      navigation.navigate('Orders');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo do Pedido</Text>
      <Text>Código: {orderCode}</Text>
      <Text>Data: {orderDate}</Text>
      <Text>Total: R$ {total.toFixed(2)}</Text>
      <Button title="Confirmar Pedido" onPress={completeOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});

export default CheckoutScreen;
