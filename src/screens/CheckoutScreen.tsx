import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import db from '../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatDate } from '../utils/formatDate';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

type CartItem = { 
  product: { price: number; [key: string]: any };
  quantity: number;
};

type Cart = Record<string, CartItem>;

const CheckoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const { cart } = route.params as { cart: Cart };
  const { setCart } = useCart();
  
  const total = Object.values(cart).reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);
  
  const orderDate = new Date().toISOString();
  const orderCode = 'PED' + Date.now();

  const completeOrder = () => {
    if (Object.keys(cart).length === 0) {
      Alert.alert('Aviso', 'Não há produtos no carrinho.');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO orders (order_code, order_date, total) VALUES (?, ?, ?);`,
        [orderCode, orderDate, total],
        (_, result) => {
          const orderId = result.insertId;
          Object.values(cart).forEach(item => {
            tx.executeSql(
              `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);`,
              [orderId, item.product.id, item.quantity, item.product.price]
            );
          });
        }
      );
    }, (error) => {
      console.log("Erro ao finalizar pedido:", error);
    }, () => {
      Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
      setCart({});
      navigation.navigate('Orders');
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Resumo do Pedido</Text>
        <Text style={styles.text}>Código: {orderCode}</Text>
        <Text style={styles.text}>Data: {formatDate(orderDate)}</Text>
        
        <Text style={styles.subtitle}>Produtos:</Text>
        {Object.values(cart).map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <View style={styles.productDetails}>
              <Text style={styles.text}>Preço Unitário: R$ {item.product.price.toFixed(2)}</Text>
              <Text style={styles.text}>Quantidade: {item.quantity}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button title="Confirmar Pedido" onPress={completeOrder} color="#DC143C" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10,
    color: '#DC143C' 
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#DC143C'
  },
  text: {
    color: '#333'
  },
  itemContainer: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000'
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 10,
    color: '#DC143C'
  },
  footer: { 
    paddingVertical: 20, 
    borderTopWidth: 1, 
    borderColor: '#ccc' 
  }
});

export default CheckoutScreen;
