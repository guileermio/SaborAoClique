import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={styles.cartRow}>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>Produto</Text>
        <Text>{item.product.name}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>Qtd.</Text>
        <Text>{item.quantity}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>Ajustar</Text>
        <View style={styles.adjustContainer}>
          <TouchableOpacity style={styles.adjustButton} onPress={() => {
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
          <TouchableOpacity style={styles.adjustButton} onPress={() => {
            const newCart = { ...cart };
            newCart[item.product.id].quantity += 1;
            setCart(newCart);
          }}>
            <Text style={styles.adjustText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>Preço Unitário</Text>
        <Text>R$ {Number(item.product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.values(cart)}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={renderCartItem}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Carrinho vazio.</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Limpar Carrinho" onPress={() => setCart({})} />
        <Button title="Finalizar Pedido" onPress={() => navigation.navigate('Checkout', { cart })} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  cartRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cell: { flex: 1, alignItems: 'center' },
  cellTitle: { fontWeight: 'bold', marginBottom: 5 },
  adjustContainer: { flexDirection: 'row' },
  adjustButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 5
  },
  adjustText: { fontSize: 18 },
  emptyMessage: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  totalContainer: { alignItems: 'center', marginVertical: 10 },
  totalText: { fontSize: 20, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

export default CartScreen;
