import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import db from '../database/Database';
import { useIsFocused } from '@react-navigation/native';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  const fetchProducts = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM products;', [], (_, { rows: { _array } }) => {
        setProducts(_array);
      });
    });
  };

  const deleteProduct = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM products WHERE id = ?;', [id], () => {
        fetchProducts();
      });
    });
  };

  const confirmDelete = (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir este produto?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => deleteProduct(id) }
    ]);
  };

  useEffect(() => {
    fetchProducts();
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name} - R$ {item.price.toFixed(2)}</Text>
      <View style={styles.buttons}>
        <Button title="Editar" onPress={() => navigation.navigate('ProductForm', { product: item })} />
        <Button title="Excluir" onPress={() => confirmDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Adicionar Produto" onPress={() => navigation.navigate('ProductForm')} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }
});

export default ProductsScreen;
