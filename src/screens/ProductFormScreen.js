import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import db from '../database/Database';

const ProductFormScreen = ({ navigation, route }) => {
  const product = route.params ? route.params.product : null;
  const [code, setCode] = useState(product ? product.code : '');
  const [name, setName] = useState(product ? product.name : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [image, setImage] = useState(product ? product.image : '');
  const [categoryId, setCategoryId] = useState(product && product.category_id ? String(product.category_id) : '');

  const saveProduct = () => {
    if (!name || !price) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (nome e preço).');
      return;
    }
    if (product) {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE products SET code = ?, name = ?, description = ?, price = ?, image = ?, category_id = ? WHERE id = ?;`,
          [code, name, description, parseFloat(price), image, categoryId ? parseInt(categoryId) : null, product.id],
          () => navigation.goBack()
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO products (code, name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?, ?);`,
          [code, name, description, parseFloat(price), image, categoryId ? parseInt(categoryId) : null],
          () => navigation.goBack()
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Código:</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} />
      <Text>Nome:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Descrição:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      <Text>Preço:</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Text>URL da Imagem:</Text>
      <TextInput style={styles.input} value={image} onChangeText={setImage} />
      <Text>ID da Categoria:</Text>
      <TextInput style={styles.input} value={categoryId} onChangeText={setCategoryId} keyboardType="numeric" />
      <Button title="Salvar Produto" onPress={saveProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 }
});

export default ProductFormScreen;
