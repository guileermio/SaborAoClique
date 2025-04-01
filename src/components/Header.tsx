import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import HamburgerMenu from './HamburgerMenu';

const Header: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'DancingScript': require('../../assets/fonts/DancingScript-VariableFont_wght.ttf'),
  });

  const navigation = useNavigation();
  const routes = useNavigationState(state => state.routes);
  const routesLength = routes.length;
  const canGoBack = routesLength > 1;
  // Obtém a rota anterior, se existir
  const previousRouteName = routesLength > 1 ? routes[routesLength - 2].name : null;

  // Função para tratar o evento de voltar
  const handleBackPress = () => {
    if (!canGoBack) return;
    if (previousRouteName === 'Checkout') {
      // Se a última tela for Checkout, redireciona para a Home
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <HamburgerMenu />
        <TouchableOpacity
          style={[styles.backButton, !canGoBack && styles.backButtonDisabled]}
          onPress={handleBackPress}
          disabled={!canGoBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={30} color={canGoBack ? '#DC143C' : '#CCC'} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>Sabor Ao Clique</Text>
          <Image
            source={require('../../assets/grandma.png')}
            style={styles.grandmaImage}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 10,
  },
  backButtonDisabled: {
    opacity: 0.5,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 35,
    fontWeight: '400',
    color: '#DC143C',
    left: -15,
    fontFamily: 'DancingScript',
  },
  grandmaImage: {
    width: 50,
    height: 50,
    opacity: 1,
    resizeMode: 'contain',
    marginLeft: 10,
    left: -20,
  },
  text: {
    zIndex: 1,
    position: 'relative',
  },
});

export default Header;
