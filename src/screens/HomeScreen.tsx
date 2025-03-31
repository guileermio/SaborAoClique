import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import HamburgerMenu from '../components/HamburgerMenu';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <HamburgerMenu />
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textTransform: 'uppercase' }]}>Consumidor</Text>
        <Button title="Produtos" onPress={() => navigation.navigate('ConsumerProducts')} />
        <Button title="Categorias" onPress={() => navigation.navigate('ConsumerCategories')} />
        <Button title="Carrinho" onPress={() => navigation.navigate('Cart')} />
        <Button title="Histórico de Pedidos" onPress={() => navigation.navigate('Orders')} />
        <Button title="Mais Vendidos" onPress={() => navigation.navigate('Additional')} />
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textTransform: 'uppercase' }]}>Administrador</Text>
        <Button title="Administrar Produtos" onPress={() => navigation.navigate('AdminProducts')} />
        <Button title="Administrar Categorias" onPress={() => navigation.navigate('AdminCategories')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});

export default HomeScreen;