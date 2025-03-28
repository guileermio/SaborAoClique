import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import db from '../database/Database';
import { useIsFocused } from '@react-navigation/native';

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const isFocused = useIsFocused();

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categories;', [], (_, { rows: { _array } }) => {
        setCategories(_array);
      });
    });
  };

  const deleteCategory = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM categories WHERE id = ?;', [id], () => {
        fetchCategories();
      });
    });
  };

  const confirmDelete = (id) => {
    Alert.alert('Excluir', 'Deseja realmente excluir esta categoria?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => deleteCategory(id) }
    ]);
  };

  useEffect(() => {
    fetchCategories();
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <View style={styles.buttons}>
        <Button title="Editar" onPress={() => navigation.navigate('CategoryForm', { category: item })} />
        <Button title="Excluir" onPress={() => confirmDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Adicionar Categoria" onPress={() => navigation.navigate('CategoryForm')} />
      <FlatList
        data={categories}
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

export default CategoriesScreen;
