import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = width * 0.6;

const HamburgerMenu: React.FC = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminLocked, setAdminLocked] = useState(true);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  
  const mainColor = '#DC143C';

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

  const toggleAdmin = () => {
    setAdminLocked(!adminLocked);
  };

  return (
    <>
      {/* Botão no header */}
      <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
        <MaterialCommunityIcons name="menu" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Menu renderizado em Modal para ocupar a tela toda */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <TouchableWithoutFeedback>
            
            <Animated.View style={[styles.menuContainer, { left: slideAnim }]}>
              <View style={styles.menuContent}>
                {/* Opção de Home */}
                <TouchableOpacity
                  style={styles.homeMenuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('Home' as never);
                  }}
                >
                  <View style={styles.iconBorder}>
                    <MaterialCommunityIcons name="home" size={30} color={mainColor} />
                  </View>
                  <Text style={styles.menuItemText}>Home</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>CONSUMIDOR</Text>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('ConsumerProducts' as never);
                  }}
                >
                  <Text style={styles.menuItemText}>Produtos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('Cart' as never);
                  }}
                >
                  <Text style={styles.menuItemText}>Carrinho</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('Orders' as never);
                  }}
                >
                  <Text style={styles.menuItemText}>Histórico de Pedidos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    navigation.navigate('Additional' as never);
                  }}
                >
                  <Text style={styles.menuItemText}>Mais Vendidos</Text>
                </TouchableOpacity>

                {/* Seção Administrador com cadeado */}
                <View style={styles.adminSection}>
                  <View style={styles.lockSection}>
                    <View style={styles.linesContainer}>
                      <View
                        style={[
                          styles.line,
                          { backgroundColor: adminLocked ? '#000' : mainColor },
                        ]}
                      />
                      <View
                        style={[
                          styles.line,
                          { backgroundColor: adminLocked ? '#000' : mainColor },
                        ]}
                      />
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.lockContainer,
                        { borderColor: adminLocked ? '#000' : mainColor },
                      ]}
                      onPress={toggleAdmin}
                    >
                      <MaterialCommunityIcons
                        name={adminLocked ? 'lock' : 'lock-open'}
                        size={30}
                        color={adminLocked ? '#000' : mainColor}
                      />
                    </TouchableOpacity>
                  </View>

                  {!adminLocked && (
                    <>
                      <Text style={styles.sectionTitle}>ADMINISTRADOR</Text>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          toggleMenu();
                          navigation.navigate('AdminProducts' as never);
                        }}
                      >
                        <Text style={styles.menuItemText}>
                          Administrar Produtos
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          toggleMenu();
                          navigation.navigate('AdminCategories' as never);
                        }}
                      >
                        <Text style={styles.menuItemText}>
                          Administrar Categorias
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    marginRight: 10,
    width: 50,
    height: 50,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#FFF',
    zIndex: 101,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  menuContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#DC143C',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  // Estilos para a seção "Home" no menu:
  homeMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBorder: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DC143C', // mesma cor do mainColor
    marginRight: 10,
  },
  adminSection: {
    marginTop: 10,
  },
  lockSection: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  linesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -2 }],
  },
  line: {
    height: 4,
    width: '40%',
  },
  lockContainer: {
    borderWidth: 2,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  
});

export default HamburgerMenu;
