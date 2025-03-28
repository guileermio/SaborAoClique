import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sabor_aoclique.db');

export const initDB = () => {
  db.transaction(tx => {
    // Tabela de categorias (ex: Bolos, Doces, Tortas)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS categories (
         id INTEGER PRIMARY KEY NOT NULL,
         name TEXT NOT NULL
      );`
    );
    // Tabela de produtos (itens de confeitaria)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
         id INTEGER PRIMARY KEY NOT NULL,
         code TEXT,
         name TEXT NOT NULL,
         description TEXT,
         price REAL NOT NULL,
         image TEXT,
         category_id INTEGER,
         FOREIGN KEY (category_id) REFERENCES categories (id)
      );`
    );
    // Tabela de pedidos (vendas)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
         id INTEGER PRIMARY KEY NOT NULL,
         order_code TEXT,
         order_date TEXT,
         total REAL
      );`
    );
    // Tabela de itens do pedido
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS order_items (
         id INTEGER PRIMARY KEY NOT NULL,
         order_id INTEGER,
         product_id INTEGER,
         quantity INTEGER,
         price REAL,
         FOREIGN KEY (order_id) REFERENCES orders (id),
         FOREIGN KEY (product_id) REFERENCES products (id)
      );`
    );
  }, (error) => {
    console.log("Erro ao inicializar o BD:", error);
  }, () => {
    console.log("Banco de dados do SaborAoClique inicializado");
  });
};

export default db;
