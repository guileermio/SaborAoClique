import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import db from '../database/Database';

const AdditionalScreen = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT p.name, SUM(oi.quantity) as totalSold 
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         GROUP BY oi.product_id
         ORDER BY totalSold DESC
         LIMIT 5;`,
        [],
        (_, { rows: { _array } }) => {
          setTopProducts(_array);
        }
      );
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name} - Vendido: {item.totalSold}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Mais Vendidos</Text>
      <FlatList
        data={topProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  item: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 5 }
});

export default AdditionalScreen;
