import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import db from '../database/Database';
import { useIsFocused } from '@react-navigation/native';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const isFocused = useIsFocused();

  const fetchOrders = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM orders;', [], (_, { rows: { _array } }) => {
        setOrders(_array);
      });
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [isFocused]);

  const renderOrder = ({ item }) => (
    <View style={styles.order}>
      <Text style={styles.orderHeader}>Código: {item.order_code}</Text>
      <Text>Data: {item.order_date}</Text>
      <Text>Total: R$ {item.total.toFixed(2)}</Text>
      <Text style={styles.itemsHeader}>Itens:</Text>
      <OrderItems orderId={item.id} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
      />
    </View>
  );
};

const OrderItems = ({ orderId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT oi.*, p.name FROM order_items oi 
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?;`,
        [orderId],
        (_, { rows: { _array } }) => {
          setItems(_array);
        }
      );
    });
  }, [orderId]);

  return (
    <View>
      {items.map(item => (
        <Text key={item.id}>- {item.name} x {item.quantity} (R$ {item.price})</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  order: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc' },
  orderHeader: { fontWeight: 'bold' },
  itemsHeader: { marginTop: 5, fontStyle: 'italic' }
});

export default OrdersScreen;
