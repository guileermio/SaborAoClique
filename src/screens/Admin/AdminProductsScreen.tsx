import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProducts'>;

const AdminProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchProducts = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM products;', [], (_, { rows: { _array } }) => setProducts(_array));
    });
  };

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categories;', [], (_, { rows: { _array } }) => setCategories(_array));
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
      fetchCategories();
    });
    return unsubscribe;
  }, [navigation]);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c: any) => c.id === categoryId);
    return cat ? cat.name : 'N/A';
  };

  const deleteProduct = (id: string) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM products WHERE id = ?;', [id], () => fetchProducts());
    });
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Aviso', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => deleteProduct(id) }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.colTitle}>ID</Text>
          <Text>{item.id}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Produto</Text>
          <Text>{item.name}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Categoria</Text>
          <Text>{getCategoryName(item.category_id)}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Preço</Text>
          <Text>R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button title="Detalhes" onPress={() => navigation.navigate('ConsumerProductDetail', { product: item, source: 'admin' })} />
        <Button title="Editar" onPress={() => navigation.navigate('AdminProductForm', { product: item })} />
        <Button title="Excluir" onPress={() => confirmDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Adicionar Produto" onPress={() => navigation.navigate('AdminProductForm')} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Não há nenhum produto.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  productItem: { backgroundColor: '#f9f9f9', borderRadius: 5, padding: 10, marginVertical: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  col: { flex: 1, alignItems: 'center' },
  colTitle: { fontWeight: 'bold', marginBottom: 3 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 }
});

export default AdminProductsScreen;
