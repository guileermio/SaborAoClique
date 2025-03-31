import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import db from '../database/Database';
import { useNavigation } from '@react-navigation/native';

const AdditionalScreen: React.FC = () => {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchTopProducts = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT p.id, p.name, p.description, p.price, p.category_id, SUM(oi.quantity) as totalSold 
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         GROUP BY oi.product_id
         ORDER BY totalSold DESC
         LIMIT 5;`,
        [],
        (_, { rows: { _array } }) => setTopProducts(_array)
      );
    });
  };

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories;',
        [],
        (_, { rows: { _array } }) => setCategories(_array)
      );
    });
  };

  useEffect(() => {
    fetchTopProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c: any) => c.id === categoryId);
    return cat ? cat.name : 'N/A';
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ConsumerProductDetail', { product: item, source: 'consumer' })}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Produto</Text>
          <Text>{item.name}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Categoria</Text>
          <Text>{getCategoryName(item.category_id)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Vendido</Text>
          <Text>{item.totalSold}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Mais Vendidos</Text>
      <FlatList
        data={topProducts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Não há nenhum produto vendido.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  item: { backgroundColor: '#ffd54f', borderRadius: 8, padding: 15, marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  col: { flex: 1, alignItems: 'center' },
  colTitle: { fontWeight: 'bold', marginBottom: 5 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 }
});

export default AdditionalScreen;
