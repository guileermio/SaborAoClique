import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Button, StyleSheet, Animated, TouchableOpacity, Modal, Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          {/* Removido o trecho que exibia o ID */}
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
            <Text style={styles.colContent}>
              R$ {Number(item.price).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </Text>
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
          title="Detalhes" 
          onPress={() => navigation.navigate('ConsumerProductDetail', { product: item, source: 'consumer' })} 
          color="#DC143C"
        />
        <Button 
          title="Adicionar ao Carrinho" 
          onPress={() => handleAddToCart(item)} 
          color="#DC143C"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
      </View>

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
            <Button 
              title="Aplicar Filtros" 
              onPress={confirmFilter} 
              color="#DC143C"
            />
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
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  filterContainer: {
    marginVertical: 10,
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
    marginVertical: 10,
    gap: 8,
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
    fontSize: 14,
    fontWeight: '500',
  },
  productItem: { 
    backgroundColor: '#f9f9f9', 
    borderRadius: 5, 
    padding: 10, 
    marginVertical: 5,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    top: 10,
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
    marginTop: 10,
    gap: 10,
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
  productImage: {
    width: '95%',
    height: '95%',
    aspectRatio: 4/3,
    borderRadius: 5,
  },
  emptyMessage: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#666' 
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    left: '10%',
    right: '10%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DC143C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedbackText: { 
    color: '#333333', 
    marginRight: 10,
    fontSize: 14,
  },
  feedbackLink: { 
    color: '#DC143C', 
    fontWeight: 'bold',
    textDecorationLine: 'underline' 
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
    borderRadius: 12, 
    padding: 20, 
    maxHeight: '80%',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center',
    color: '#DC143C',
  },
  modalItem: { 
    padding: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#eeeeee', 
  },
  selectedItem: {
    backgroundColor: '#FFF0F0',
  },
  selectedText: { 
    fontWeight: 'bold', 
    color: '#DC143C',
  },
});

export default ConsumerProductsScreen;
