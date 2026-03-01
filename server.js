const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Requer instalação: npm install multer
const app = express();
const port = 3000;

// Middleware para processar JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir arquivos enviados

const ARQUIVO_DADOS = path.join(__dirname, 'dados_produtor.json');
const ARQUIVO_DADOS_PRODUCAO = path.join(__dirname, 'dados_producao.json');
const ARQUIVO_DOCUMENTOS = path.join(__dirname, 'dados_documentos.json');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

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

// Rota para OBTER a lista de documentos (GET)
app.get('/api/documentos', (req, res) => {
    if (fs.existsSync(ARQUIVO_DOCUMENTOS)) {
        const dados = fs.readFileSync(ARQUIVO_DOCUMENTOS);
        res.json(JSON.parse(dados));
    } else {
        res.json([]);
    }
});

// Rota para FAZER UPLOAD de documento (POST)
app.post('/api/documentos', upload.single('arquivo'), (req, res) => {
    const descricao = req.body.descricao;
    const arquivo = req.file;

    if (!arquivo) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    let documentos = [];
    if (fs.existsSync(ARQUIVO_DOCUMENTOS)) {
        documentos = JSON.parse(fs.readFileSync(ARQUIVO_DOCUMENTOS));
    }

    const novoDocumento = {
        descricao: descricao,
        filename: arquivo.filename,
        originalname: arquivo.originalname,
        path: arquivo.path
    };

    documentos.push(novoDocumento);
    fs.writeFileSync(ARQUIVO_DOCUMENTOS, JSON.stringify(documentos, null, 2));

    res.json({ message: 'Documento salvo com sucesso!' });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/produtor.html`);
});
