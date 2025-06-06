require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306
});

// Verificar conexão
db.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco MySQL');
});

// Rotas da API

// Listar todos os produtos
app.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
    res.json(results);
  });
});

// Buscar produtos por nome ou embalagem
app.get('/buscar', (req, res) => {
  const termoBusca = req.query.q;
  if (!termoBusca) {
    return res.status(400).json({ erro: 'Parâmetro de busca ausente' });
  }

  const termo = `%${termoBusca}%`;

  db.query(
    'SELECT * FROM produtos WHERE nome_produto LIKE ? OR embalagem LIKE ?',
    [termo, termo],
    (err, results) => {
      if (err) {
        console.error('Erro na busca:', err);
        return res.status(500).json({ erro: 'Erro na busca' });
      }
      res.json(results);
    }
  );
});

// Buscar por ID
app.get('/produtos/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar produto' });
    if (results.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(results[0]);
  });
});

// Rota padrão para carregar o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Substituir quaisquer rotas desconhecidas por 404 ou redirecionamento opcional
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
