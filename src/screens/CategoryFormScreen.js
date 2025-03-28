import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import db from '../database/Database';

const CategoryFormScreen = ({ navigation, route }) => {
  const category = route.params ? route.params.category : null;
  const [name, setName] = useState(category ? category.name : '');

  const saveCategory = () => {
    if (!name) {
      Alert.alert('Erro', 'Informe o nome da categoria.');
      return;
    }
    if (category) {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE categories SET name = ? WHERE id = ?;`,
          [name, category.id],
          () => navigation.goBack()
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO categories (name) VALUES (?);`,
          [name],
          () => navigation.goBack()
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nome da Categoria:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Button title="Salvar Categoria" onPress={saveCategory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10 }
});

export default CategoryFormScreen;
