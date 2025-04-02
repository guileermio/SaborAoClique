import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image } from 'react-native';
import db from '../database/Database';
import { formatDate } from '../utils/formatDate';

const PRIMARY_COLOR = '#DC143C';
const TEXT_COLOR = '#333';
const BORDER_COLOR = '#ccc';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT o.id, o.order_code, o.order_date, o.total, o.note, 
                oi.product_id, oi.quantity, oi.price, 
                p.name as product_name, p.image as product_image
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN products p ON oi.product_id = p.id;`,
        [],
        (_, { rows: { _array } }) => {
          const grouped = {};
          _array.forEach(row => {
            if (!grouped[row.id]) {
              grouped[row.id] = {
                id: row.id,
                order_code: row.order_code,
                order_date: row.order_date,
                total: row.total,
                note: row.note,
                items: [],
              };
            }
            if (row.product_id) {
              grouped[row.id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price,
                image: row.product_image,
              });
            }
          });
          const sortedOrders = Object.values(grouped).sort(
            (a, b) => new Date(b.order_date) - new Date(a.order_date)
          );
          setOrders(sortedOrders);
        }
      );
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => (
    <View style={styles.order}>
      <Text style={styles.orderHeader}>Código: {item.order_code}</Text>
      <Text style={styles.orderText}>Data: {formatDate(item.order_date)}</Text>
      {item.note ? (
        <Text style={styles.note}>Observações: {item.note}</Text>
      ) : null}
      <Text style={styles.total}>
        Total: R$ {Number(item.total).toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}
      </Text>
      {item.items.length > 0 && (
        <View style={styles.itemsContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.itemHeaderText, styles.productColumn]}>Itens</Text>
            <Text style={[styles.headerText, styles.quantityColumn]}>Qtd.</Text>
            <Text style={[styles.headerText, styles.priceColumn]}>Preço Unit.</Text>
          </View>
          {item.items.map((it, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.productInfo}>
                {it.image && (
                  <Image 
                    source={{ uri: `data:image/jpeg;base64,${it.image}` }}
                    style={styles.productImage}
                  />
                )}
                <Text style={styles.productName}>{it.product_name}</Text>
              </View>
              <Text style={styles.quantity}>x{it.quantity}</Text>
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
      <Button title="Voltar para Home" onPress={() => navigation.navigate('Home')} color={PRIMARY_COLOR} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  order: { 
    marginBottom: 20, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: BORDER_COLOR, 
    borderRadius: 5 
  },
  orderHeader: { 
    fontWeight: 'bold', 
    color: PRIMARY_COLOR, 
    fontSize: 16 
  },
  orderText: { 
    color: TEXT_COLOR, 
    fontSize: 14 
  },
  note: {
    fontStyle: 'italic',
    color: TEXT_COLOR,
    marginVertical: 5,
  },
  total: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    marginVertical: 10, 
    color: PRIMARY_COLOR 
  },
  itemsContainer: { 
    marginTop: 10, 
    paddingLeft: 10 
  },
  tableHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 5, 
    paddingHorizontal: 5 
  },
  headerText: { 
    fontWeight: 'bold', 
    flex: 1, 
    color: PRIMARY_COLOR, 
    fontSize: 14 
  },
  itemHeaderText: {
    fontWeight: 'bold', 
    flex: 1, 
    color: PRIMARY_COLOR, 
    fontSize: 14,
  },
  itemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 5, 
    marginBottom: 8 
  },
  productInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DC143C80',
  },
  productName: { 
    color: TEXT_COLOR, 
    fontSize: 14 
  },
  quantity: { 
    flex: 0.5, 
    textAlign: 'right', 
    color: TEXT_COLOR, 
    fontSize: 14,
    left: -32,
  },
  price: { 
    flex: 1, 
    textAlign: 'right', 
    color: TEXT_COLOR, 
    fontSize: 14,
    left: -44,
  },
  productColumn: { flex: 2 },
  quantityColumn: { flex: 0.5 },
  priceColumn: { flex: 1 },
  emptyMessage: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#666' 
  }
});

export default OrdersScreen;
