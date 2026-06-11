const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configuração da conexão com o banco de dados usando variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Testar a conexão com o banco de dados assim que o container inicia
pool.connect((err, client, release) => {
  if (err) {
    return console.error(' Erro crítico ao conectar no PostgreSQL:', err.message);
  }
  console.log(' Conexão com o PostgreSQL estabelecida com sucesso!');
  release();
});

// Rota principal isolada com tratamento de erro robusto
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<h1>🚀 API Status</h1><p>A API está rodando e conectada ao PostgreSQL!</p><p><b>Hora no banco:</b> ${result.rows[0].now}</p>`);
  } catch (err) {
    console.error('Erro na rota principal:', err.message);
    res.status(500).setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<h1>⚠️ Erro de Conexão</h1><p>A API está ativa no IP 0.0.0.0, mas não conseguiu ler dados do banco.</p><p><b>Detalhe do erro:</b> ${err.message}</p>`);
  }
});

// Garante que a aplicação escuta na interface correta para o Docker
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando e pronto na porta ${port}`);
});