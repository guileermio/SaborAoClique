import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import db from '../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const { cart } = route.params as { cart: any };
  const { setCart } = useCart();
  const total = Object.values(cart).reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
  const orderCode = 'PED' + Date.now();
  const orderDate = new Date().toISOString();

  const confirmOrder = () => {
    if (Object.keys(cart).length === 0) {
      Alert.alert('Aviso', 'Não há produtos no carrinho.');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO orders (order_code, order_date, total) VALUES (?, ?, ?);`,
        [orderCode, orderDate, total],
        (_, result) => {
          const orderId = result.insertId;
          Object.values(cart).forEach((item: any) => {
            tx.executeSql(
              `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);`,
              [orderId, item.product.id, item.quantity, item.product.price]
            );
          });
        }
      );
    }, (error) => {
      Alert.alert('Erro', 'Não foi possível finalizar o pedido: ' + error.message);
    }, () => {
      Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
      setCart({});
      // Reseta a navegação para Home (assim o back vai para Home)
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Resumo do Pedido</Text>
        <Text>Código: {orderCode}</Text>
        <Text>Data: {orderDate}</Text>
        <Text style={styles.totalText}>
          Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Confirmar Pedido" onPress={confirmOrder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  totalText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#ccc' },
});

export default CheckoutScreen;
