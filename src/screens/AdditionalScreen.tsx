import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import db from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const AdditionalScreen: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'DancingScript': require('../../assets/fonts/DancingScript-VariableFont_wght.ttf'),
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchTopProducts = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT p.id, p.name, p.description, p.price, p.image, p.category_id, SUM(oi.quantity) as totalSold 
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         GROUP BY oi.product_id
         ORDER BY totalSold DESC;`,
        [],
        (_, { rows: { _array } }) => {
          const processed = processProducts(_array);
          setTopProducts(processed);
        }
      );
    });
  };

  const processProducts = (products: any[]) => {
    let currentRank = 0;
    let previousSold: number | null = null;
    const sorted = [...products].sort((a, b) => b.totalSold - a.totalSold);
    const rankedProducts = [];

    for (const product of sorted) {
      if (product.totalSold !== previousSold) {
        currentRank++;
        previousSold = product.totalSold;
      }
      
      if (currentRank > 5) break;

      rankedProducts.push({
        ...product,
        rank: currentRank,
        rankGroup: Math.min(currentRank - 1, 4)
      });
    }
    return rankedProducts;
  };

  const fetchCategories = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories;',
        [],
        (_, { rows: { _array } }) => setCategories(_array)
      );
    });
  };

  useEffect(() => {
    fetchTopProducts();
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c: any) => c.id === categoryId);
    return cat ? cat.name : 'N/A';
  };

  const getRankColor = (rankGroup: number) => {
    const colors = [
      '#FFD700', // Ouro
      '#C0C0C0', // Prata
      '#CD7F32', // Bronze
      '#87CEEB', // Azul
      '#90EE90'  // Verde
    ];
    return colors[rankGroup] || '#f5f5f5';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { backgroundColor: getRankColor(item.rankGroup) }]}
      onPress={() => navigation.navigate('ConsumerProductDetail', { product: item, source: 'consumer' })}
    >
      <View style={styles.rankFlag}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <View style={[styles.textContent, styles.textRightPadding]}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PRODUTO</Text>
            <Text style={styles.productName}>{item.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>CATEGORIA</Text>
            <Text style={styles.categoryText}>{getCategoryName(item.category_id)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>VENDIDOS</Text>
            <Text style={styles.salesText}>{item.totalSold}</Text>
          </View>
        </View>

        {item.image && (
          <TouchableOpacity 
            style={styles.imageWrapper}
            onPress={() => navigation.navigate('ProductImage', { image: item.image })}
          >
            <Image 
              source={{ uri: `data:image/jpeg;base64,${item.image}` }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>TOP PRODUTOS</Text>
      
      <FlatList
        data={topProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Nenhum produto vendido ainda</Text>
        }
      />

      <Text style={styles.ctaText}>Clique e experimente!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#DC143C',
    textAlign: 'center',
    marginVertical: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  itemContainer: {
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  rankFlag: {
    position: 'absolute',
    top: -20,
    left: -30,
    backgroundColor: '#DC143C',
    width: 90,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
    borderWidth: 2,
    borderColor: '#fff',
  },
  rankText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
    marginLeft: 12,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  textRightPadding: {
    marginLeft: 35,
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 8,
  },
  salesText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC143C',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff90',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: '#ffffff50',
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 36,
    textAlign: 'center',
    color: '#DC143C',
    marginVertical: 24,
    fontFamily: 'DancingScript',
    textShadowColor: '#00000010',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default AdditionalScreen;