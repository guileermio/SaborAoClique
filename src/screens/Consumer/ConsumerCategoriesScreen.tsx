import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Modal
} from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Category = {
  id: string;
  name: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerCategories'>;

const ConsumerCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories;',
        [],
        (_, { rows: { _array } }) => setCategories(_array)
      );
    });
  };

  const fetchProducts = (categoryIds: string[]) => {
    db.transaction(tx => {
      let query = 'SELECT * FROM products';
      let params: any[] = [];
      if (categoryIds.length > 0) {
        query += ' WHERE category_id IN (' + categoryIds.map(() => '?').join(',') + ')';
        params = categoryIds;
      }
      tx.executeSql(query + ';', params, (_, { rows: { _array } }) => {
        setFilteredProducts(_array);
      });
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategorySelection = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmFilter = () => {
    setFilterModalVisible(false);
    fetchProducts(selectedCategories);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar por Categoria</Text>
      <Button title="Opções de Filtro" onPress={() => setFilterModalVisible(true)} />
      {selectedCategories.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedCategories.map(id => {
            const cat = categories.find(c => c.id === id);
            return (
              <View key={id} style={styles.chip}>
                <Text>{cat ? cat.name : id}</Text>
              </View>
            );
          })}
        </View>
      )}
      {selectedCategories.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhum filtro aplicado.</Text>
      ) : (
        <FlatList 
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <View style={styles.itemBlock}>
                <Text style={styles.blockTitle}>Produto</Text>
                <Text>{item.name}</Text>
              </View>
              <View style={styles.itemBlock}>
                <Text style={styles.blockTitle}>Categoria</Text>
                <Text>{categories.find(c => c.id === item.category_id)?.name || 'N/A'}</Text>
              </View>
              <View style={styles.itemBlock}>
                <Text style={styles.blockTitle}>Preço</Text>
                <Text>R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              Nenhum produto encontrado para os filtros aplicados.
            </Text>
          }
        />
      )}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione as Categorias</Text>
            <FlatList 
              data={categories}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => toggleCategorySelection(item.id)}
                >
                  <Text style={selectedCategories.includes(item.id) ? styles.selectedText : undefined}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Confirmar" onPress={confirmFilter} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
  chip: { backgroundColor: '#eee', padding: 5, marginRight: 5, marginBottom: 5, borderRadius: 5 },
  productItem: { backgroundColor: '#f9f9f9', borderRadius: 5, padding: 10, marginVertical: 5 },
  itemBlock: { marginBottom: 5, alignItems: 'center' },
  blockTitle: { fontWeight: 'bold' },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  modalOverlay: { flex:1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectedText: { fontWeight: 'bold', color: 'green' },
});

export default ConsumerCategoriesScreen;
