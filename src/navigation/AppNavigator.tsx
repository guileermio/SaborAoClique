import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AdminProductsScreen from '../screens/Admin/AdminProductsScreen';
import AdminProductFormScreen from '../screens/Admin/AdminProductFormScreen';
import AdminCategoriesScreen from '../screens/Admin/AdminCategoriesScreen';
import AdminCategoryFormScreen from '../screens/Admin/AdminCategoryFormScreen';
import ConsumerProductsScreen from '../screens/Consumer/ConsumerProductsScreen';
import ConsumerProductDetailScreen from '../screens/Consumer/ConsumerProductDetailScreen';
import ConsumerCategoriesScreen from '../screens/Consumer/ConsumerCategoriesScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AdditionalScreen from '../screens/AdditionalScreen';

export type RootStackParamList = {
  Home: undefined;
  // ADM
  AdminProducts: undefined;
  AdminProductForm: { product?: any } | undefined;
  AdminCategories: undefined;
  AdminCategoryForm: { category?: any } | undefined;
  // Consumidor
  ConsumerProducts: { filter?: string[] } | undefined;
  ConsumerProductDetail: { product: any };
  ConsumerCategories: undefined;
  // Compartilhadas
  Cart: undefined;
  Checkout: { cart: any };
  Orders: undefined;
  Additional: undefined;
};

function ConsumerProductsWrapper(props: NativeStackScreenProps<RootStackParamList, 'ConsumerProducts'>) {
  return <ConsumerProductsScreen {...props} />;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SaborAoClique' }} />

        {/* ADM */}
        <Stack.Screen name="AdminProducts" component={AdminProductsScreen} options={{ title: 'Administrar Produtos' }} />
        <Stack.Screen name="AdminProductForm" component={AdminProductFormScreen} options={{ title: 'Cadastro / Detalhes do Produto' }} />
        <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Administrar Categorias' }} />
        <Stack.Screen name="AdminCategoryForm" component={AdminCategoryFormScreen} options={{ title: 'Cadastro / Detalhes da Categoria' }} />

        {/* Consumidor */}
        <Stack.Screen
          name="ConsumerProducts"
          component={ConsumerProductsWrapper}
          options={{ title: 'Produtos' }}
        />
        <Stack.Screen name="ConsumerProductDetail" component={ConsumerProductDetailScreen} options={{ title: 'Detalhes do Produto' }} />
        <Stack.Screen
          name="ConsumerCategories"
          component={ConsumerProductsWrapper}
          options={{ title: 'Categorias' }}
        />
        {/* Compartilhadas */}
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Carrinho de Compras' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar Pedido' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Histórico de Pedidos' }} />
        <Stack.Screen name="Additional" component={AdditionalScreen} options={{ title: 'Mais Vendidos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
