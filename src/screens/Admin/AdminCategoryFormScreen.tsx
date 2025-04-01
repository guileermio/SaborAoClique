import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import db from '../../database/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminCategoryForm'>;

const AdminCategoryFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const category = route.params?.category;
  const [id, setId] = useState<string>(category ? category.id : '');
  const [name, setName] = useState<string>(category ? category.name : '');

  useEffect(() => {
    if (!category) {
      // Gera ID automaticamente no formato CAT01, CAT02, ...
      db.transaction(tx => {
        tx.executeSql('SELECT COUNT(*) as count FROM categories;', [], (_, { rows }) => {
          const count = rows.item(0).count;
          const newId = 'CAT' + String(count + 1).padStart(2, '0');
          setId(newId);
        });
      });
    }
  }, []);

  const saveCategory = () => {
    if (!id) {
      return Alert.alert('Aviso', 'ID não gerado.');
    }
    if (!name.trim()) {
      return Alert.alert('Aviso', 'O campo "Nome" é obrigatório.');
    }
    if (!category) {
      // Verifica duplicidade de ID
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM categories WHERE id = ?;', [id], (_, { rows }) => {
          if (rows.length > 0) {
            Alert.alert('Aviso', 'Já existe uma categoria com esse ID.');
          } else {
            insertCategory();
          }
        });
      });
    } else {
      updateCategory();
    }
  };

  const insertCategory = () => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO categories (id, name) VALUES (?, ?);`,
        [id, name],
        () => {
          Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
          navigation.goBack();
        },
        (txObj, error) => {
          console.error('Erro na inserção da categoria:', error);
          Alert.alert('Erro', 'Não foi possível adicionar a categoria: ' + error.message);
          return false;
        }
      );
    });
  };

  const updateCategory = () => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE categories SET name = ? WHERE id = ?;`,
        [name, id],
        () => {
          Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
          navigation.goBack();
        },
        (txObj, error) => {
          console.error('Erro na atualização da categoria:', error);
          Alert.alert('Erro', 'Não foi possível atualizar a categoria: ' + error.message);
          return false;
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID da Categoria:</Text>
      <TextInput style={[styles.input, { backgroundColor: '#eee' }]} value={id} editable={false} />
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Button title="Salvar Categoria" onPress={saveCategory} color="#DC143C" />
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
  }
});

export default AdminCategoryFormScreen;