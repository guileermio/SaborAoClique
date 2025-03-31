import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerProductDetail'> & {
  route: {
    params: {
      product: any;
      source?: string; // 'admin' se acessado por admin
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
        <Button title="Adicionar ao Carrinho" onPress={handleAddToCart} />
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
  container: { flex: 1, padding: 20, alignItems: 'center' },
  image: { width: 200, height: 200, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  price: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
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

export default ConsumerProductDetailScreen;
