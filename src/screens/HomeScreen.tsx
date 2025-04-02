import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [adminLocked, setAdminLocked] = useState(true);
  const mainColor = '#DC143C';
  const darkMainColor = '#B01030';

  const IconButton = ({ icon, label, onPress, pencil, admin, customIcon }:
    { icon: string, label: string, onPress: () => void, pencil?: boolean, admin?: boolean, customIcon?: JSX.Element }) => (
    <TouchableOpacity
      style={[styles.iconContainer, admin && styles.adminIconContainer]}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        <View style={[styles.iconBorder, { borderColor: mainColor }, admin && styles.adminIconBorder]}>
          {customIcon || (
            <MaterialCommunityIcons
              name={icon}
              size={admin ? 80 : 54}
              color={admin ? darkMainColor : mainColor}
            />
          )}
        </View>
        {pencil && (
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={darkMainColor}
            style={[styles.pencilOverlay, { backgroundColor: 'transparent' }]}
          />
        )}
      </View>
      <Text style={[styles.iconLabel, { color: admin ? darkMainColor : '#333' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* O Header já é renderizado pelo AppNavigator */}

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Seja bem-vindo,</Text>
        <Text style={[styles.welcomeText, styles.consumerText]}>CONSUMIDOR</Text>
      </View>

      {/* Seção Consumidor */}
      <View style={styles.grid}>
        <IconButton icon="cake" label="Produtos" onPress={() => navigation.navigate('ConsumerProducts')} />
        <IconButton icon="basket-outline" label="Carrinho" onPress={() => navigation.navigate('Cart')} />
        <IconButton icon="history" label="Histórico" onPress={() => navigation.navigate('Orders')} />
        <IconButton icon="star-box" label="Mais Vendidos" onPress={() => navigation.navigate('Additional')} />
      </View>

      {/* Container para cadeado e painel de administração */}
      <View style={styles.adminContainer}>
        {/* Seção Cadeado */}
        <View style={styles.lockSection}>
          <View style={styles.linesContainer}>
            <View style={[styles.line, { backgroundColor: adminLocked ? '#000' : mainColor }]} />
            <View style={[styles.line, { backgroundColor: adminLocked ? '#000' : mainColor }]} />
          </View>

          <TouchableOpacity
            style={[styles.lockContainer, { borderColor: adminLocked ? '#000' : mainColor }]}
            onPress={() => setAdminLocked(!adminLocked)}
          >
            <MaterialCommunityIcons
              name={adminLocked ? "lock" : "lock-open"}
              size={40}
              color={adminLocked ? "#000" : mainColor}
            />
          </TouchableOpacity>
        </View>

        {/* Seção Administrador */}
        {!adminLocked && (
          <>
            <Text style={styles.adminTitle}>PAINEL DE ADMINISTRAÇÃO</Text>
            <View style={[styles.grid, { marginTop: 15 }]}>
              <IconButton
                icon="cake"
                label="Produtos"
                pencil
                admin
                onPress={() => navigation.navigate('AdminProducts')}
              />
              <IconButton
                icon="view-grid"
                label="Categorias"
                pencil
                admin
                onPress={() => navigation.navigate('AdminCategories')}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 30,
    marginTop: -15,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  consumerText: {
    color: '#DC143C',
    marginTop: 8,
    fontSize: 32,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 25,
  },
  iconContainer: {
    width: 140,
    alignItems: 'center',
    margin: 12,
  },
  adminIconContainer: {
    width: 130,
  },
  iconWrapper: {
    position: 'relative',
  },
  iconBorder: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminIconBorder: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#B01030',
    padding: 20,
  },
  iconLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  adminContainer: {
    marginTop: -45,
  },
  lockSection: {
    marginVertical: 30,
    alignItems: 'center',
  },
  linesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: '50%',
  },
  line: {
    height: 2,
    width: '38%',
    marginHorizontal: 10,
  },
  lockContainer: {
    borderWidth: 2,
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B01030',
    textAlign: 'center',
    marginBottom: 20,
  },
  pencilOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default HomeScreen;
