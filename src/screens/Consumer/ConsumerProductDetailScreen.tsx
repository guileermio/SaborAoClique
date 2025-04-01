import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerProductDetail'> & {
  route: {
    params: {
      product: any;
      source?: string; // 'admin' se acessado via admin
    }
  }
};

const ConsumerProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product, source } = route.params;
  const { addToCart } = useCart();
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleAddToCart = () => {
    addToCart(product);
    setFeedbackVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setFeedbackVisible(false));
    }, 4000);
  };

  return (
    <View style={styles.container}>
      {product.image ? <Image source={{ uri: product.image }} style={styles.image} /> : null}
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>
        R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>
      {source !== 'admin' && (
        <Button color="#DC143C" title="Adicionar ao Carrinho" onPress={handleAddToCart} />
      )}
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
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  description: { fontSize: 16, marginBottom: 10, color: '#555' },
  price: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#DC143C' },
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
});

export default ConsumerProductDetailScreen;