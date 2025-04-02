import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { useCart } from '../context/CartContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { cart, setCart } = useCart();
  const [total, setTotal] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    const newTotal = Object.values(cart).reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.cellTitle}>Produto:</Text>
            <Text 
              style={styles.text} 
              numberOfLines={2} 
              ellipsizeMode="tail"
            >
              {item.product.name}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.cellTitleQtd}>Quantidade:</Text>
            <Text style={[styles.text, styles.quantityText]}>{item.quantity}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.adjustButton} 
                onPress={() => {
                  const newCart = { ...cart };
                  if (newCart[item.product.id].quantity > 1) {
                    newCart[item.product.id].quantity -= 1;
                  } else {
                    delete newCart[item.product.id];
                  }
                  setCart(newCart);
                }}>
                <Text style={styles.adjustText}>–</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.adjustButton} 
                onPress={() => {
                  const newCart = { ...cart };
                  newCart[item.product.id].quantity += 1;
                  setCart(newCart);
                }}>
                <Text style={styles.adjustText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.cellTitle}>Preço Unitário:</Text>
            <Text style={styles.text}>
              R$ {Number(item.product.price).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </Text>
          </View>
        </View>
        {item.product.image && (
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => navigation.navigate('ProductImage', { image: item.product.image })}
          >
            <Image 
              source={{ uri: `data:image/jpeg;base64,${item.product.image}` }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.values(cart)}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Carrinho vazio.</Text>
        }
      />
      <View style={styles.noteContainer}>
        <Text style={styles.noteLabel}>Observações:</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Digite aqui observações do pedido"
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: R$ {total.toLocaleString('pt-BR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Limpar Carrinho" 
          onPress={() => setCart({})} 
          color="#DC143C"
        />
        <Button
          title="Finalizar Pedido"
          onPress={() => {
            if (Object.keys(cart).length === 0) {
              Alert.alert(
                "Aviso",
                "Carrinho vazio. Adicione itens ao seu carrinho antes de finalizar o pedido.",
                [{ text: "OK" }]
              );
            } else {
              navigation.navigate('Checkout', { cart, note });
            }
          }}
          color="#DC143C"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#ffffff' 
  },
  item: {
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
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  cellTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
    minWidth: 110,
  },
  cellTitleQtd: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
    minWidth: 110,
    top: 5,
  },
  text: {
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
    left: -10,
    top: 5,
    fontSize: 15,
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
    width: '100%',
    height: '100%',
    aspectRatio: 4/3,
    borderRadius: 5,
  },
  adjustButton: {
    width: 35,
    height: 35,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    left: -10,
  },
  adjustText: {
    fontSize: 20,
    color: '#ffffff',
    lineHeight: 24,
  },
  emptyMessage: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#666' 
  },
  totalContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC143C',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
    marginTop: 10,
  },
  noteContainer: {
    marginVertical: 10,
  },
  noteLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#DC143C',
    borderRadius: 5,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fff'
  },
});

export default CartScreen;