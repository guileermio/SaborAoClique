import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const db = SQLite.openDatabase('sabor_aoclique.db');

const getBase64FromAsset = async (assetModule) => {
  try {
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();
    if (!asset.localUri) {
      throw new Error('localUri não disponível');
    }
    return await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (error) {
    console.log("Erro ao converter imagem para base64:", error);
    return null;
  }
};

export const initDB = async () => {
  db.transaction(tx => {
    // Remove tabelas antigas, se existirem
    tx.executeSql('DROP TABLE IF EXISTS categories;');
    tx.executeSql('DROP TABLE IF EXISTS products;');
    tx.executeSql('DROP TABLE IF EXISTS orders;');
    tx.executeSql('DROP TABLE IF EXISTS order_items;');

    // Cria a tabela de categorias
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS categories (
         id TEXT PRIMARY KEY NOT NULL,
         name TEXT NOT NULL
      );`
    );

    // Cria a tabela de produtos
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
         id TEXT PRIMARY KEY NOT NULL,
         name TEXT NOT NULL,
         description TEXT NOT NULL,
         price REAL NOT NULL,
         category_id TEXT,
         image TEXT,
         FOREIGN KEY (category_id) REFERENCES categories(id)
      );`
    );

    // Cria a tabela de pedidos (adicionada a coluna "note")
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         order_code TEXT,
         order_date TEXT,
         total REAL,
         note TEXT
      );`
    );

    // Cria a tabela de itens de pedido
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
  }, async () => {
    console.log("Banco de dados do SaborAoClique inicializado");

    // Inserir categorias
    db.transaction(tx => {
      const categories = [
        { id: 'CAT01', name: 'Bolos' },
        { id: 'CAT02', name: 'Tortas' },
        { id: 'CAT03', name: 'Doces' },
        { id: 'CAT04', name: 'Salgados' },
        { id: 'CAT05', name: 'Bebidas' }
      ];
      
      categories.forEach(cat => {
        tx.executeSql('INSERT INTO categories (id, name) VALUES (?, ?);', [cat.id, cat.name]);
      });
    }, (error) => {
      console.log("Erro ao inserir categorias:", error);
    }, () => {
      console.log("Categorias inseridas com sucesso!");
    });

    // Lista de 15 produtos com imagens em assets
    const products = [
      { id: 'PROD01', name: 'Bolo de Chocolate', description: 'Delicioso bolo de chocolate com cobertura cremosa.', price: 35.90, category_id: 'CAT01', image: require('../../assets/imgsInicializacaoDB/BoloDeChocolate.jpg') },
      { id: 'PROD02', name: 'Bolo Red Velvet', description: 'Clássico Red Velvet com recheio de cream cheese.', price: 42.50, category_id: 'CAT01', image: require('../../assets/imgsInicializacaoDB/BoloDeRedVelvet.jpg') },
      { id: 'PROD03', name: 'Bolo de Cenoura', description: 'Bolo caseiro de cenoura com cobertura de chocolate.', price: 30.00, category_id: 'CAT01', image: require('../../assets/imgsInicializacaoDB/BoloDeCenoura.jpg') },
      
      { id: 'PROD04', name: 'Torta de Limão', description: 'Torta leve e refrescante com cobertura de merengue.', price: 28.90, category_id: 'CAT02', image: require('../../assets/imgsInicializacaoDB/TortaDeLimao.jpg') },
      { id: 'PROD05', name: 'Torta de Morango', description: 'Base crocante com creme de baunilha e morangos.', price: 33.00, category_id: 'CAT02', image: require('../../assets/imgsInicializacaoDB/TortaDeMorango.jpg') },
      { id: 'PROD06', name: 'Cheesecake', description: 'Clássico cheesecake com calda de frutas vermelhas.', price: 40.00, category_id: 'CAT02', image: require('../../assets/imgsInicializacaoDB/Cheesecake.jpg') },
      
      { id: 'PROD07', name: 'Brigadeiro Gourmet', description: 'Brigadeiro cremoso coberto com granulado belga.', price: 3.50, category_id: 'CAT03', image: require('../../assets/imgsInicializacaoDB/BrigadeiroGourmet.jpg') },
      { id: 'PROD08', name: 'Beijinho', description: 'Doce de coco com leite condensado e açúcar.', price: 3.50, category_id: 'CAT03', image: require('../../assets/imgsInicializacaoDB/Beijinho.jpg') },
      { id: 'PROD09', name: 'Brownie', description: 'Brownie de chocolate meio amargo com nozes.', price: 7.00, category_id: 'CAT03', image: require('../../assets/imgsInicializacaoDB/Brownie.jpg') },
      
      { id: 'PROD10', name: 'Coxinha', description: 'Clássica coxinha recheada com frango e catupiry.', price: 6.00, category_id: 'CAT04', image: require('../../assets/imgsInicializacaoDB/Coxinha.jpg') },
      { id: 'PROD11', name: 'Pão de Queijo', description: 'Pão de queijo mineiro crocante por fora e macio por dentro.', price: 4.00, category_id: 'CAT04', image: require('../../assets/imgsInicializacaoDB/PaoDeQueijo.jpg') },
      { id: 'PROD12', name: 'Empada de Palmito', description: 'Empada artesanal recheada com palmito cremoso.', price: 5.50, category_id: 'CAT04', image: require('../../assets/imgsInicializacaoDB/EmpadinhaDePalmito.jpg') },
      
      { id: 'PROD13', name: 'Café Expresso', description: 'Café forte e encorpado feito na hora.', price: 5.00, category_id: 'CAT05', image: require('../../assets/imgsInicializacaoDB/CafeExpresso.jpg') },
      { id: 'PROD14', name: 'Capuccino', description: 'Café cremoso com espuma de leite e chocolate.', price: 8.50, category_id: 'CAT05', image: require('../../assets/imgsInicializacaoDB/Capuccino.jpg') },
      { id: 'PROD15', name: 'Suco Natural', description: 'Suco natural feito com frutas frescas.', price: 7.00, category_id: 'CAT05', image: require('../../assets/imgsInicializacaoDB/SucoNatural.jpg') }
    ];

    // Para cada produto, converte a imagem em base64 e insere no banco
    for (const prod of products) {
      const base64Image = await getBase64FromAsset(prod.image);
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO products (id, name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?, ?);`,
          [prod.id, prod.name, prod.description, prod.price, prod.category_id, base64Image],
          () => console.log(`Produto ${prod.name} inserido com sucesso!`),
          (txObj, error) => {
            console.log(`Erro ao inserir ${prod.name}: `, error);
            return false;
          }
        );
      });
    }

    // Após inserir os produtos, cria um pedido "dummy" e insere vendas aleatórias para cada produto
    db.transaction(tx => {
      // Insere um pedido de base para agrupar os itens
      tx.executeSql(
        `INSERT INTO orders (order_code, order_date, total, note) VALUES (?, ?, ?, ?);`,
        [
          'dummy-order',
          new Date().toISOString(),
          0,
          'Pedido de seed para inicializar número de vendas'
        ],
        (_, result) => {
          const orderId = result.insertId;
          // Para cada produto, insere um item de pedido com quantidade aleatória entre 30 e 250
          products.forEach(prod => {
            const randomQuantity = Math.floor(Math.random() * (250 - 30 + 1)) + 30;
            tx.executeSql(
              `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);`,
              [orderId, prod.id, randomQuantity, prod.price],
              () => console.log(`Vendas para ${prod.name} inseridas: ${randomQuantity}`),
              (txObj, error) => {
                console.log(`Erro ao inserir vendas para ${prod.name}:`, error);
                return false;
              }
            );
          });
        }
      );
    });
  });
};

export default db;
