const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Requer instalação: npm install multer
const mongoose = require('mongoose'); // Adicionado para o MongoDB
require('dotenv').config(); // Adicionado para carregar variáveis de ambiente

const app = express();
const port = 3000;

// Middleware para processar JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir arquivos enviados

// --- Conexão com o MongoDB ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado ao MongoDB com sucesso!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// --- Mongoose Schemas e Models ---
// Schema flexível para Produtor e Producao, já que a estrutura original era um JSON livre
const GenericDataSchema = new mongoose.Schema({}, { strict: false });

const Produtor = mongoose.model('Produtor', GenericDataSchema);
const Producao = mongoose.model('Producao', GenericDataSchema);

// Schema para Documentos
const DocumentoSchema = new mongoose.Schema({
    descricao: String,
    filename: String,
    originalname: String,
    path: String,
    createdAt: { type: Date, default: Date.now } // Adicionado para rastreamento
});
const Documento = mongoose.model('Documento', DocumentoSchema);

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

// --- Rotas da API atualizadas para o MongoDB ---

// Rota para OBTER os dados do produtor (GET)
app.get('/api/produtor', async (req, res) => {
    try {
        const dados = await Produtor.findOne();
        res.json(dados || {}); // Retorna dados ou objeto vazio para manter consistência
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados do produtor.', error: error.message });
    }
});

// Rota para SALVAR os dados do produtor (POST)
app.post('/api/produtor', async (req, res) => {
    try {
        const dados = req.body;
        // Encontra e atualiza o único documento, ou cria se não existir (upsert: true)
        const produtorAtualizado = await Produtor.findOneAndUpdate({}, dados, { upsert: true, new: true });
        res.json({ message: 'Dados salvos com sucesso!', data: produtorAtualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar dados do produtor.', error: error.message });
    }
});

// Rota para OBTER os dados de PRODUÇÃO (GET)
app.get('/api/producao', async (req, res) => {
    try {
        const dados = await Producao.findOne();
        res.json(dados || {});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados de produção.', error: error.message });
    }
});

// Rota para SALVAR os dados de PRODUÇÃO (POST)
app.post('/api/producao', async (req, res) => {
    try {
        const dados = req.body;
        const producaoAtualizada = await Producao.findOneAndUpdate({}, dados, { upsert: true, new: true });
        res.json({ message: 'Dados de produção salvos com sucesso!', data: producaoAtualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar dados de produção.', error: error.message });
    }
});

// Rota para OBTER a lista de documentos (GET)
app.get('/api/documentos', async (req, res) => {
    try {
        const documentos = await Documento.find().sort({ createdAt: -1 }); // Ordena pelos mais recentes
        res.json(documentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar documentos.', error: error.message });
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

        const novoDocumento = new Documento({
            descricao: descricao,
            filename: arquivo.filename,
            originalname: arquivo.originalname,
            path: arquivo.path
        });

        await novoDocumento.save();
        res.status(201).json({ message: 'Documento salvo com sucesso!', documento: novoDocumento });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar documento.', error: error.message });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/produtor.html`);
});
