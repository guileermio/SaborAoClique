import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';
import { useIsFocused } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerProducts'>;

const ConsumerProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState<string[]>([]);
  const { addToCart } = useCart();
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const isFocused = useIsFocused();

  const fetchProducts = (categoryIds: string[] = []) => {
    db.transaction(tx => {
      let query = 'SELECT * FROM products';
      let params: any[] = [];
      
      if (categoryIds.length > 0) {
        query += ' WHERE category_id IN (' + categoryIds.map(() => '?').join(',') + ')';
        params = categoryIds;
      }

      tx.executeSql(query, params, (_, { rows: { _array } }) => {
        setFilteredProducts(_array);
      });
    });
  };

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categories;', [], (_, { rows: { _array } }) => setCategories(_array));
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchCategories();
      fetchProducts(selectedCategories);
    }
  }, [isFocused]);

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

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setFeedbackVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setFeedbackVisible(false));
    }, 4000);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
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
          <Text style={styles.colTitle}>Preço</Text>
          <Text>R$ {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button title="Detalhes" onPress={() => navigation.navigate('ConsumerProductDetail', { product: item, source: 'consumer' })} />
        <Button title="Adicionar ao Carrinho" onPress={() => handleAddToCart(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button 
        title="Opções de Filtro" 
        onPress={openFilterModal}
        color="#007AFF"
      />

      {selectedCategories.length > 0 && (
        <View style={styles.chipsContainer}>
          {selectedCategories.map(id => {
            const cat = categories.find(c => c.id === id);
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

      <FlatList 
        data={filteredProducts} 
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

      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Selecione as Categorias</Text>
            <FlatList 
              data={categories}
              keyExtractor={item => item.id}
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
            <Button title="Aplicar Filtros" onPress={confirmFilter} />
          </View>
        </TouchableOpacity>
      </Modal>

      {feedbackVisible && (
        <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
          <Text style={styles.feedbackText}>Produto adicionado ao carrinho</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.feedbackLink}>VER</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    left: '10%',
    right: '10%',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  feedbackText: { color: '#fff', marginRight: 10 },
  feedbackLink: { color: '#0af', textDecorationLine: 'underline' },
  chipsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginVertical: 10,
    gap: 5,
  },
  chip: { 
    backgroundColor: '#e3f2fd', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  chipText: {
    color: '#1976d2',
    fontSize: 14,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: { 
    width: '90%', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 15, 
    maxHeight: '80%',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center',
    color: '#333',
  },
  modalItem: { 
    padding: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
  },
  selectedItem: {
    backgroundColor: '#f0f4ff',
  },
  selectedText: { 
    fontWeight: 'bold', 
    color: '#1a73e8',
  },
});

export default ConsumerProductsScreen;