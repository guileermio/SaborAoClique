import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import CategorySelect from '../../components/CategorySelect';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProductForm'>;

const AdminProductFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const product = route.params?.product;
  const [id, setId] = useState(product ? product.id : '');
  const [name, setName] = useState(product ? product.name : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [price, setPrice] = useState(product ? 
    Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
    : '');
  const [image, setImage] = useState(product ? product.image : '');
  const [categoryId, setCategoryId] = useState(product ? product.category_id : '');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectVisible, setSelectVisible] = useState(false);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categories;', [], (_, { rows: { _array } }) => {
        setCategories(_array);
      });
    });
    if (!product) {
      db.transaction(tx => {
        tx.executeSql('SELECT COUNT(*) as count FROM products;', [], (_, { rows }) => {
          const count = rows.item(0).count;
          const newId = 'PROD' + String(count + 1).padStart(2, '0');
          setId(newId);
        });
      });
    }
  }, []);

  const parsePriceInput = (input: string): number => {
    const normalized = input.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(normalized);
  };

  const saveProduct = () => {
    if (!id) return Alert.alert('Aviso', 'ID do produto não gerado.');
    if (!name.trim()) return Alert.alert('Aviso', 'O campo Nome é obrigatório.');
    if (!description.trim()) return Alert.alert('Aviso', 'O campo Descrição é obrigatório.');
    if (!price) return Alert.alert('Aviso', 'O campo Preço é obrigatório.');
    const numericPrice = parsePriceInput(price);
    if (isNaN(numericPrice)) return Alert.alert('Aviso', 'Preço inválido.');
    if (numericPrice < 0) return Alert.alert('Aviso', 'Preço não pode ser negativo.');
    if (!categoryId) return Alert.alert('Aviso', 'Selecione uma Categoria.');

    if (!product) {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM products WHERE id = ?;', [id], (_, { rows }) => {
          if (rows.length > 0) {
            Alert.alert('Aviso', 'Já existe um produto com esse ID.');
          } else {
            insertProduct();
          }
        });
      });
    } else {
      updateProduct();
    }
  };

  const insertProduct = () => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO products (id, name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?, ?);`,
        [id, name, description, parsePriceInput(price), image, categoryId],
        () => {
          Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
          navigation.goBack();
        },
        (txObj, error) => {
          Alert.alert('Erro', 'Não foi possível adicionar o produto: ' + error.message);
          return false;
        }
      );
    });
  };

  const updateProduct = () => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ? WHERE id = ?;`,
        [name, description, parsePriceInput(price), image, categoryId, id],
        () => {
          Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
          navigation.goBack();
        },
        (txObj, error) => {
          Alert.alert('Erro', 'Não foi possível atualizar o produto: ' + error.message);
          return false;
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID do Produto:</Text>
      <TextInput style={[styles.input, { backgroundColor: '#eee' }]} value={id} editable={false} />
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Descrição:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      <Text style={styles.label}>Preço:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Text style={styles.label}>URL da Imagem (opcional):</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />
      <Text style={styles.label}>Categoria:</Text>
      <TouchableOpacity style={styles.selectButton} onPress={() => setSelectVisible(true)}>
        <Text style={styles.selectButtonText}>
          {categoryId 
            ? categories.find((cat: any) => cat.id === categoryId)?.name || "Selecionar Categoria" 
            : "Selecionar Categoria"}
        </Text>
      </TouchableOpacity>
      <CategorySelect 
         visible={selectVisible} 
         categories={categories} 
         onSelect={(id) => { setCategoryId(id); setSelectVisible(false); }} 
         onClose={() => setSelectVisible(false)} 
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Salvar Produto" onPress={saveProduct} color="#DC143C" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', color: '#DC143C', marginBottom: 5 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginBottom: 10, 
    borderRadius: 5 
  },
  selectButton: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 
  },
  selectButtonText: {
    color: '#DC143C',
    textAlign: 'center'
  },
});

export default AdminProductFormScreen;
