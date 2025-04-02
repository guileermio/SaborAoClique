import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AdminProductsScreen from '../screens/Admin/AdminProductsScreen';
import AdminProductFormScreen from '../screens/Admin/AdminProductFormScreen';
import AdminCategoriesScreen from '../screens/Admin/AdminCategoriesScreen';
import AdminCategoryFormScreen from '../screens/Admin/AdminCategoryFormScreen';
import ConsumerProductsScreen from '../screens/Consumer/ConsumerProductsScreen';
import ConsumerProductDetailScreen from '../screens/Consumer/ConsumerProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AdditionalScreen from '../screens/AdditionalScreen';
import ProductImageScreen from '../screens/ProductImageScreen';
import Header from '../components/Header'; // Importe seu componente Header

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
  // Nova tela para visualização da imagem
  ProductImage: { image: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        header: () => (
          <Header 
            title={route.params?.title || getDefaultTitle(route.name)}
            showBackButton={route.name !== 'Home'}
          />
        ),
        headerShown: shouldShowHeader(route.name),
      })}
    >
      {/* Telas com header personalizado */}
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'SaborAoClique' }}
      />

      {/* ADM */}
      <Stack.Screen 
        name="AdminProducts" 
        component={AdminProductsScreen} 
        options={{ title: 'Administrar Produtos' }} 
      />
      <Stack.Screen 
        name="AdminProductForm" 
        component={AdminProductFormScreen} 
        options={{ title: 'Cadastro do Produto' }} 
      />
      <Stack.Screen 
        name="AdminCategories" 
        component={AdminCategoriesScreen} 
        options={{ title: 'Administrar Categorias' }} 
      />
      <Stack.Screen 
        name="AdminCategoryForm" 
        component={AdminCategoryFormScreen} 
        options={{ title: 'Cadastro da Categoria' }} 
      />

      {/* Consumidor */}
      <Stack.Screen 
        name="ConsumerProducts" 
        component={ConsumerProductsScreen} 
        options={{ title: 'Produtos' }} 
      />
      <Stack.Screen 
        name="ConsumerProductDetail" 
        component={ConsumerProductDetailScreen} 
        options={{ title: 'Detalhes do Produto' }} 
      />

      {/* Compartilhadas */}
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'Carrinho de Compras' }} 
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ title: 'Finalizar Pedido' }} 
      />
      <Stack.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ title: 'Histórico de Pedidos' }} 
      />
      <Stack.Screen 
        name="Additional" 
        component={AdditionalScreen} 
        options={{ title: 'Mais Vendidos' }} 
      />

      {/* Tela sem header */}
      <Stack.Screen 
        name="ProductImage" 
        component={ProductImageScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

// Funções auxiliares para o header
const getDefaultTitle = (routeName: string): string => {
  const titleMap: { [key: string]: string } = {
    Home: 'SaborAoClique',
    AdminProducts: 'Administrar Produtos',
    AdminProductForm: 'Cadastro de Produto',
    AdminCategories: 'Categorias',
    AdminCategoryForm: 'Cadastro de Categoria',
    ConsumerProducts: 'Produtos',
    ConsumerProductDetail: 'Detalhes do Produto',
    Cart: 'Carrinho',
    Checkout: 'Checkout',
    Orders: 'Pedidos',
    Additional: 'Mais Vendidos'
  };
  return titleMap[routeName] || 'SaborAoClique';
};

const shouldShowHeader = (routeName: string): boolean => {
  const noHeaderRoutes = ['ProductImage'];
  return !noHeaderRoutes.includes(routeName);
};

export default AppNavigator;