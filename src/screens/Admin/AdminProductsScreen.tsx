import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Button, Alert, StyleSheet, 
  Image, TouchableOpacity, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProducts'>;

const AdminProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories;',
        [],
        (_, { rows: { _array } }) => setCategories(_array)
      );
    });
  };

  const fetchProducts = (categoryIds: string[] = []) => {
    db.transaction(tx => {
      let query = 'SELECT * FROM products';
      let params: any[] = [];
      
      if (categoryIds.length > 0) {
        query += ' WHERE category_id IN (' + categoryIds.map(() => '?').join(',') + ')';
        params = categoryIds;
      }

      tx.executeSql(query, params, (_, { rows: { _array } }) => setProducts(_array));
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCategories();
      fetchProducts(selectedCategories);
    });
    return unsubscribe;
  }, [navigation, selectedCategories]);

  const handleChipPress = (categoryId: string) => {
    const newSelected = selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(newSelected);
    fetchProducts(newSelected);
  };

  const openFilterModal = () => {
    setTempSelectedCategories([...selectedCategories]);
    setFilterModalVisible(true);
  };

  const toggleCategorySelection = (id: string) => {
    setTempSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmFilter = () => {
    setFilterModalVisible(false);
    setSelectedCategories(tempSelectedCategories);
    fetchProducts(tempSelectedCategories);
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c: any) => c.id === categoryId);
    return cat ? cat.name : 'N/A';
  };

  const deleteProduct = (id: string) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM products WHERE id = ?;', [id], () => fetchProducts(selectedCategories));
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
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.colTitle}>ID:</Text>
            <Text style={styles.colContent}>{item.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.colTitle}>Produto:</Text>
            <Text style={styles.colContent}>{item.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.colTitle}>Categoria:</Text>
            <Text style={styles.colContent}>{getCategoryName(item.category_id)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.colTitle}>Preço:</Text>
            <Text style={styles.colContent}>R$ {Number(item.price).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}</Text>
          </View>
        </View>
        {item.image && (
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => navigation.navigate('ProductImage', { image: item.image })}
          >
            <Image 
              source={{ uri: `data:image/jpeg;base64,${item.image}` }} 
              style={styles.productImage} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttons}>
        <Button 
          color="#DC143C" 
          title="Detalhes" 
          onPress={() => navigation.navigate('ConsumerProductDetail', { product: item, source: 'admin' })} 
        />
        <Button 
          color="#DC143C" 
          title="Editar" 
          onPress={() => navigation.navigate('AdminProductForm', { product: item })} 
        />
        <Button 
          color="#DC143C" 
          title="Excluir" 
          onPress={() => confirmDelete(item.id)} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button 
        color="#DC143C" 
        title="Adicionar Produto" 
        onPress={() => navigation.navigate('AdminProductForm')} 
      />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
          <MaterialCommunityIcons 
            name="view-grid" 
            size={24} 
            color="#FFF" 
            style={styles.filterIcon}
          />
          <Text style={styles.filterText}>Opções de Filtro</Text>
        </TouchableOpacity>
        {selectedCategories.length > 0 && (
          <View style={styles.chipsContainer}>
            {selectedCategories.map(id => {
              const cat = categories.find((c: any) => c.id === id);
              return (
                <TouchableOpacity
                  key={id}
                  style={styles.chip}
                  onPress={() => handleChipPress(id)}
                >
                  <Text style={styles.chipText}>{cat ? cat.name : id}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {selectedCategories.length === 0 
              ? "Nenhum produto disponível." 
              : "Nenhum produto encontrado para os filtros aplicados."}
          </Text>
        }
      />

      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione as Categorias</Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalItem,
                        tempSelectedCategories.includes(item.id) && styles.selectedItem
                      ]}
                      onPress={() => toggleCategorySelection(item.id)}
                    >
                      <Text style={tempSelectedCategories.includes(item.id) ? styles.selectedText : undefined}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <Button 
                  color="#DC143C" 
                  title="Aplicar Filtros" 
                  onPress={confirmFilter} 
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  filterContainer: { 
    marginVertical: 10 
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    borderRadius: 5,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  chipsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 10 
  },
  chip: { 
    backgroundColor: '#FFE5E5', 
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DC143C80',
  },
  chipText: {
    color: '#DC143C',
    fontSize: 12
  },
  row: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 3 
  },
  colTitle: { 
    fontSize: 15,
    fontWeight: 'bold', 
    marginRight: 5, 
    color: '#333',
    textAlign: 'center',
  },
  colContent: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },
  buttons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 10 
  },
  emptyMessage: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#666' 
  },
  productItem: { 
    backgroundColor: '#f9f9f9', 
    borderRadius: 5, 
    padding: 10, 
    marginVertical: 5 
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  productImage: {
    width: '95%',
    height: '95%',
    aspectRatio: 4 / 3,
    borderRadius: 5,
  },
  imageContainer: {
    width: 150,
    height: 112.5,
    borderWidth: 1.7,
    borderColor: '#DC143C',
    borderRadius: 5,
    overflow: 'hidden', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#DC143C' 
  },
  modalItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  selectedText: { 
    fontWeight: 'bold', 
    color: '#DC143C' 
  },
  selectedItem: {
    backgroundColor: '#FFF0F0',
  },
});

export default AdminProductsScreen;
