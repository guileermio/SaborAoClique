import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryFormScreen from '../screens/CategoryFormScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AdditionalScreen from '../screens/AdditionalScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SaborAoClique' }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Gerenciar Produtos' }} />
        <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Cadastro de Produto' }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Gerenciar Categorias' }} />
        <Stack.Screen name="CategoryForm" component={CategoryFormScreen} options={{ title: 'Cadastro de Categoria' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho de Compras' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar Pedido' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Histórico de Pedidos' }} />
        <Stack.Screen name="Additional" component={AdditionalScreen} options={{ title: 'Mais Vendidos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
