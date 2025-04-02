import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerProductDetail'> & {
  route: {
    params: {
      product: any;
      source?: string;
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
      {/* Container da imagem com sombra */}
      <View style={styles.imageWrapper}>
        <TouchableOpacity 
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ProductImage', { image: product.image })}
        >
          <Image 
            source={{ uri: `data:image/jpeg;base64,${product.image}` }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </TouchableOpacity>
      </View>

      {/* Card de detalhes do produto */}
      <View style={styles.detailsCard}>
        <Text style={styles.title}>{product.name}</Text>
        <View style={styles.divider} />

        {/* Seção de descrição */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DESCRIÇÃO</Text>
          <Text style={styles.description}>
            {product.description || 'Nenhuma descrição disponível'}
          </Text>
          <View style={styles.textUnderline} />
        </View>

        {/* Seção de preço */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>PREÇO</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              R$ {Number(product.price).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </Text>
            <View style={styles.priceLine} />
          </View>
        </View>

        {/* Botão de adicionar ao carrinho */}
        {source !== 'admin' && (
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.cartButtonText}>ADICIONAR AO CARRINHO</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Feedback de adição ao carrinho */}
      {feedbackVisible && (
        <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
          <Text style={styles.feedbackText}>Produto adicionado ao carrinho</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.feedbackLink}>VER CARRINHO</Text>
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
    backgroundColor: '#f8f9fa',
  },
  imageWrapper: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: '#DC143C40',
    borderRadius: 12,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: 16,
    marginHorizontal: -24,
  },
  detailItem: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC143C',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 12,
  },
  priceContainer: {
    position: 'relative',
    paddingBottom: 8,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#DC143C',
    letterSpacing: 0.5,
  },
  priceLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#DC143C20',
    borderRadius: 2,
  },
  textUnderline: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginTop: 16,
  },
  cartButton: {
    backgroundColor: '#DC143C',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 30,
    left: '5%',
    right: '5%',
    backgroundColor: '#ffffff',
    padding: 16,
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
    marginRight: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  feedbackLink: { 
    color: '#DC143C', 
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default ConsumerProductDetailScreen;