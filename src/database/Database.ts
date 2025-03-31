import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('sabor_aoclique.db');

export const initDB = () => {
  db.transaction(tx => {
    // Para desenvolvimento: dropar tabelas para recriação com o schema correto
    tx.executeSql('DROP TABLE IF EXISTS categories;');
    tx.executeSql('DROP TABLE IF EXISTS products;');
    tx.executeSql('DROP TABLE IF EXISTS orders;');
    tx.executeSql('DROP TABLE IF EXISTS order_items;');

    // Criação das tabelas com os tipos desejados
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS categories (
         id TEXT PRIMARY KEY NOT NULL,
         name TEXT NOT NULL
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
         id TEXT PRIMARY KEY NOT NULL,
         name TEXT NOT NULL,
         description TEXT NOT NULL,
         price REAL NOT NULL,
         image TEXT,
         category_id TEXT,
         FOREIGN KEY (category_id) REFERENCES categories(id)
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         order_code TEXT,
         order_date TEXT,
         total REAL
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS order_items (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         order_id INTEGER,
         product_id TEXT,
         quantity INTEGER,
         price REAL,
         FOREIGN KEY (order_id) REFERENCES orders(id),
         FOREIGN KEY (product_id) REFERENCES products(id)
      );`
    );
  }, (error) => {
    console.log("Erro ao inicializar o BD:", error);
  }, () => {
    console.log("Banco de dados do SaborAoClique inicializado");
  });
};

export default db;
