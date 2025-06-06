// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'listadedoces'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
    return;
  }
  console.log('Conexão com MySQL estabelecida.');
});

module.exports = connection;
