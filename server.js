const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Requer instalação: npm install multer

const app = express();
const port = 3000;

// Middleware de CORS para permitir acesso de outras portas (ex: Live Server ou aberturas via file://)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// Middleware para processar JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir arquivos enviados

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // fs é mantido apenas para esta verificação de diretório
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

// Rota para OBTER os dados diretamente do arquivo dados_produtor.json (GET)
app.get('/api/ler-json-produtor', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_produtor.json');
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(fileData));
        } else {
            res.json({}); // Retorna vazio caso o arquivo ainda não exista
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao ler o arquivo JSON.', error: error.message });
    }
});

// Rota para SALVAR os dados diretamente no arquivo dados_produtor.json (POST)
app.post('/api/salvar-json-produtor', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_produtor.json');
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ message: 'Dados salvos com sucesso no arquivo JSON!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar no arquivo JSON.', error: error.message });
    }
});

// Rota para SALVAR os dados diretamente no arquivo dados_producao.json (POST)
app.post('/api/salvar-json-producao', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_producao.json');
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ message: 'Dados de produção salvos com sucesso no arquivo JSON!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar no arquivo JSON.', error: error.message });
    }
});

// Rota para FAZER UPLOAD de documento (POST)
app.post('/api/documentos', upload.single('arquivo'), async (req, res) => {
    try {
        const { descricao } = req.body;
        const arquivo = req.file;

        if (!arquivo) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        res.status(201).json({ message: 'Documento salvo localmente com sucesso!', file: arquivo.filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar documento.', error: error.message });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/produtor.html`);
});
