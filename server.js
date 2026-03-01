const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para processar JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(__dirname));

const ARQUIVO_DADOS = path.join(__dirname, 'dados_produtor.json');
const ARQUIVO_DADOS_PRODUCAO = path.join(__dirname, 'dados_producao.json');

// Rota para OBTER os dados salvos (GET)
app.get('/api/produtor', (req, res) => {
    if (fs.existsSync(ARQUIVO_DADOS)) {
        const dados = fs.readFileSync(ARQUIVO_DADOS);
        res.json(JSON.parse(dados));
    } else {
        res.json({}); // Retorna objeto vazio se o arquivo não existir
    }
});

// Rota para SALVAR os dados (POST)
app.post('/api/produtor', (req, res) => {
    const dados = req.body;
    fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(dados, null, 2));
    res.json({ message: 'Dados salvos com sucesso!' });
});

// Rota para OBTER os dados de PRODUÇÃO (GET)
app.get('/api/producao', (req, res) => {
    if (fs.existsSync(ARQUIVO_DADOS_PRODUCAO)) {
        const dados = fs.readFileSync(ARQUIVO_DADOS_PRODUCAO);
        res.json(JSON.parse(dados));
    } else {
        res.json({});
    }
});

// Rota para SALVAR os dados de PRODUÇÃO (POST)
app.post('/api/producao', (req, res) => {
    const dados = req.body;
    fs.writeFileSync(ARQUIVO_DADOS_PRODUCAO, JSON.stringify(dados, null, 2));
    res.json({ message: 'Dados de produção salvos com sucesso!' });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/produtor.html`);
});
