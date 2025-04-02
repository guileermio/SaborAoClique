import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import CategorySelect from '../../components/CategorySelect';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProductForm'>;

const AdminProductFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const product = route.params?.product;
  const [id, setId] = useState(product ? product.id : '');
  const [name, setName] = useState(product ? product.name : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [price, setPrice] = useState(product ? 
    Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
    : '');
  // Armazena a imagem como base64
  const [image, setImage] = useState<string | null>(product ? product.image : null);
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop()!;
      const newPath = FileSystem.documentDirectory + fileName;
  
      try {
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newPath,
        });
        // Lê o arquivo copiado e converte para base64
        const base64Image = await FileSystem.readAsStringAsync(newPath, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setImage(base64Image);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a imagem');
      }
    }
  };

  const parsePriceInput = (input: string): number => {
    const normalized = input.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(normalized);
  };

  const saveProduct = () => {
    if (!id) return Alert.alert('Aviso', 'ID do produto não gerado.');
    if (!name.trim()) return Alert.alert('Aviso', 'O campo Nome é obrigatório.');
    if (!description.trim()) return Alert.alert('Aviso', 'O campo Descrição é obrigatório.');
    if (!price) return Alert.alert('Aviso', 'O campo Preço é obrigatório.');
    // Verifica se a imagem foi selecionada
    if (!image) return Alert.alert('Aviso', 'A imagem do produto é obrigatória.');
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
        `INSERT INTO products (id, name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?, ?);`,
        [id, name, description, parsePriceInput(price), categoryId, image],
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
    <ScrollView style={styles.scrollContainer}>
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
        <Text style={styles.label}>Imagem:</Text>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {image ? 'Alterar Imagem' : 'Selecionar Imagem'}
          </Text>
        </TouchableOpacity>
        {image && (
          <Image 
            source={{ uri: `data:image/jpeg;base64,${image}` }} 
            style={styles.imagePreview} 
            resizeMode="cover"
          />
        )}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
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
  imageButton: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  buttonText: {
    color: '#DC143C',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AdminProductFormScreen;
