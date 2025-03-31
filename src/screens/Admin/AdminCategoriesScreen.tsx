import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminCategories'>;

const AdminCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categories;', [], (_, { rows: { _array } }) => setCategories(_array));
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchCategories);
    return unsubscribe;
  }, [navigation]);

  const deleteCategory = (id: string) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM categories WHERE id = ?;', [id], () => fetchCategories());
    });
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Aviso', 'Deseja realmente excluir esta categoria?', [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: () => deleteCategory(id) }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.categoryItem}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.colTitle}>Categoria</Text>
          <Text>{item.name}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.colTitle}>ID</Text>
          <Text>{item.id}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button title="Editar" onPress={() => navigation.navigate('AdminCategoryForm', { category: item })} />
        <Button title="Excluir" onPress={() => confirmDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Adicionar Categoria" onPress={() => navigation.navigate('AdminCategoryForm')} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Não há nenhuma categoria.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  categoryItem: { backgroundColor: '#f9f9f9', borderRadius: 5, padding: 10, marginVertical: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  col: { flex: 1, alignItems: 'center' },
  colTitle: { fontWeight: 'bold', marginBottom: 3 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 }
});

export default AdminCategoriesScreen;
