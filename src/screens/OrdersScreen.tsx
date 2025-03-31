// src/screens/OrdersScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import db from '../database/Database';
import { formatDate } from '../utils/formatDate';

type OrderItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  order_code: string;
  order_date: string;
  total: number;
  items: OrderItem[];
};

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    // Consulta com JOIN para recuperar os pedidos com seus itens e o nome do produto.
    db.transaction(tx => {
      tx.executeSql(
        `SELECT o.id, o.order_code, o.order_date, o.total, 
                oi.product_id, oi.quantity, oi.price, p.name as product_name
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN products p ON oi.product_id = p.id;`,
        [],
        (_, { rows: { _array } }) => {
          // Agrupa os resultados por order id
          const grouped: { [key: number]: Order } = {};
          _array.forEach((row: any) => {
            if (!grouped[row.id]) {
              grouped[row.id] = {
                id: row.id,
                order_code: row.order_code,
                order_date: row.order_date,
                total: row.total,
                items: [],
              };
            }
            if (row.product_id) {
              grouped[row.id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price,
              });
            }
          });
          setOrders(Object.values(grouped));
        }
      );
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [navigation]);

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.order}>
      <Text style={styles.orderHeader}>Código: {item.order_code}</Text>
      <Text>Data: {formatDate(item.order_date)}</Text>
      <Text>Total: R$ {Number(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      {item.items && item.items.length > 0 && (
        <View style={styles.itemsContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.productColumn]}>Itens</Text>
            <Text style={[styles.headerText, styles.quantityColumn]}>Qtd.</Text>
            <Text style={[styles.headerText, styles.priceColumn]}>Preço Unit.</Text>
          </View>
          {item.items.map((it, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.productName}>{it.product_name}</Text>
              <Text style={styles.quantity}>x {it.quantity}</Text>
              <Text style={styles.price}>
                R$ {Number(it.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  itemsContainer: { marginTop: 10, paddingLeft: 10 },
  itemsTitle: { fontWeight: 'bold', marginBottom: 5 },
  itemText: { marginBottom: 3 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      paddingHorizontal: 5,
    },
    headerText: {
      fontWeight: 'bold',
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
      marginBottom: 3,
    },
    productColumn: {
      flex: 2,
    },
    quantityColumn: {
      flex: 0.5,
      textAlign: 'right',
    },
    priceColumn: {
      flex: 1,
      textAlign: 'right',
    },
    productName: {
      flex: 2,
    },
    quantity: {
      flex: 0.5,
      textAlign: 'right',
    },
    price: {
      flex: 1,
      textAlign: 'right',
    },
});

export default OrdersScreen;
