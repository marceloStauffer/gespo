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

// Rota para INSERIR um novo registro de receita no arquivo dados_receitas.json (POST)
app.post('/api/salvar-json-receitas', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_receitas.json');
        let receitas = [];
        
        // Se o arquivo já existir, lê e transforma o conteúdo em array
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            if (fileData.trim() !== "") receitas = JSON.parse(fileData);
        }
        
        // Adiciona o novo registro e sobrescreve o arquivo
        receitas.push(req.body);
        fs.writeFileSync(filePath, JSON.stringify(receitas, null, 2));
        res.json({ message: 'Receita salva com sucesso no arquivo JSON!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar no arquivo JSON.', error: error.message });
    }
});

// Rota para ATUALIZAR um registro de receita (PUT)
app.put('/api/receitas/:index', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_receitas.json');
        if (fs.existsSync(filePath)) {
            let receitas = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const index = parseInt(req.params.index);
            if (index >= 0 && index < receitas.length) {
                receitas[index] = req.body; // Substitui os dados pelo novo form
                fs.writeFileSync(filePath, JSON.stringify(receitas, null, 2));
                return res.json({ message: 'Receita atualizada com sucesso!' });
            }
        }
        res.status(404).json({ message: 'Registro não encontrado.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar no JSON.', error: error.message });
    }
});

// Rota para EXCLUIR um registro de receita (DELETE)
app.delete('/api/receitas/:index', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_receitas.json');
        if (fs.existsSync(filePath)) {
            let receitas = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const index = parseInt(req.params.index);
            if (index >= 0 && index < receitas.length) {
                receitas.splice(index, 1); // Remove 1 item no index correspondente
                fs.writeFileSync(filePath, JSON.stringify(receitas, null, 2));
                return res.json({ message: 'Receita excluída com sucesso!' });
            }
        }
        res.status(404).json({ message: 'Registro não encontrado.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir no JSON.', error: error.message });
    }
});

// Rota para INSERIR um novo registro de despesa no arquivo dados_despesas.json (POST)
app.post('/api/salvar-json-despesas', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_despesas.json');
        let despesas = [];
        
        // Se o arquivo já existir, lê e transforma o conteúdo em array
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            if (fileData.trim() !== "") despesas = JSON.parse(fileData);
        }
        
        // Adiciona o novo registro e sobrescreve o arquivo
        despesas.push(req.body);
        fs.writeFileSync(filePath, JSON.stringify(despesas, null, 2));
        res.json({ message: 'Despesa salva com sucesso no arquivo JSON!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar no arquivo JSON.', error: error.message });
    }
});

// Rota para INSERIR um novo registro de patrimônio no arquivo dados_patrimonio.json (POST)
app.post('/api/salvar-json-patrimonio', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'dados_patrimonio.json');
        let patrimonio = [];
        
        // Se o arquivo já existir, lê e transforma o conteúdo em array
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            if (fileData.trim() !== "") patrimonio = JSON.parse(fileData);
        }
        
        // Adiciona o novo registro e sobrescreve o arquivo
        patrimonio.push(req.body);
        fs.writeFileSync(filePath, JSON.stringify(patrimonio, null, 2));
        res.json({ message: 'Patrimônio salvo com sucesso no arquivo JSON!' });
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
