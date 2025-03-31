import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerProducts'>;

const ConsumerProductsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [products, setProducts] = useState<any[]>([]);
  const filter = route.params?.filter;
  const { addToCart } = useCart();
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const fetchProducts = () => {
    db.transaction(tx => {
      let query = 'SELECT * FROM products';
      let params: any[] = [];
      if (filter && filter.length > 0) {
        query += ' WHERE category_id IN (' + filter.map(() => '?').join(',') + ')';
        params = filter;
      }
      tx.executeSql(query + ';', params, (_, { rows: { _array } }) => setProducts(_array));
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProducts);
    return unsubscribe;
  }, [navigation, route.params]);

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
          <Text>{item.category_id}</Text>
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
      <FlatList 
         data={products} 
         keyExtractor={(item) => item.id.toString()} 
         renderItem={renderItem} 
         ListEmptyComponent={<Text style={styles.emptyMessage}>Não há nenhum produto.</Text>} 
      />
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
  feedbackLink: { color: '#0af', textDecorationLine: 'underline' }
});

export default ConsumerProductsScreen;
