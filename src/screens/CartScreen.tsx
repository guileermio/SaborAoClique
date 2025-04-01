import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { cart, setCart } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = Object.values(cart).reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>Produto</Text>
          <Text style={styles.text}>{item.product.name}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>Qtd.</Text>
          <Text style={styles.text}>{item.quantity}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.cellTitle}>Preço Unitário</Text>
          <Text style={styles.text}>
            R$ {Number(item.product.price).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </Text>
        </View>
      </View>
      <View style={styles.adjustContainer}>
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
              navigation.navigate('Checkout', { cart });
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
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  cellTitle: {
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333333',
    fontSize: 14,
  },
  text: {
    color: '#666666',
    fontSize: 14,
  },
  adjustContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 10,
  },
  adjustButton: {
    width: 40,
    height: 40,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  adjustText: {
    fontSize: 24,
    color: '#ffffff',
    lineHeight: 28,
  },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20, color: '#666' },
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
});

export default CartScreen;