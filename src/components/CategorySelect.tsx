import React from 'react';
import { Modal, FlatList, TouchableOpacity, Text, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';

type Category = {
  id: string;
  name: string;
};

type Props = {
  visible: boolean;
  categories: Category[];
  onSelect: (categoryId: string) => void;
  onClose: () => void;
};

const CategorySelect: React.FC<Props> = ({ visible, categories, onSelect, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => { onSelect(item.id); }}>
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  itemText: {
    fontSize: 16,
  }
});

export default CategorySelect;
