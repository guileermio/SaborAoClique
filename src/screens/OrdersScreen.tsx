import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import db from '../database/Database';
import { useIsFocused } from '@react-navigation/native';

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
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

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.order}>
      <Text style={styles.orderHeader}>Código: {item.order_code}</Text>
      <Text>Data: {item.order_date}</Text>
      <Text>Total: R$ {Number(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Não há nenhum pedido.</Text>}
      />
      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  order: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc' },
  orderHeader: { fontWeight: 'bold' },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 }
});

export default OrdersScreen;
