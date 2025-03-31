import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.6;

const HamburgerMenu: React.FC = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
        <Text style={styles.hamburgerText}>≡</Text>
      </TouchableOpacity>
      {menuVisible && (
        <Animated.View style={[styles.menuContainer, { left: slideAnim }]}>
          <View style={styles.menuContent}>
            <Text style={styles.sectionTitle}>CONSUMIDOR</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('ConsumerProducts'); }}>
              <Text>Produtos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Cart'); }}>
              <Text>Carrinho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Orders'); }}>
              <Text>Histórico de Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('Additional'); }}>
              <Text>Mais Vendidos</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>ADMINISTRADOR</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('AdminProducts'); }}>
              <Text>Administrar Produtos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { toggleMenu(); navigation.navigate('AdminCategories'); }}>
              <Text>Administrar Categorias</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  hamburgerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#fff',
    zIndex: 99,
  },
  menuContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HamburgerMenu;
