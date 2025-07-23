const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const database = require('./database/database');
const notificationService = require('./services/notificationService');
const cronService = require('./services/cronService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.get('/api/contas', async (req, res) => {
    try {
        const contas = await database.getAllContas();
        res.json(contas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contas', async (req, res) => {
    try {
        const { descricao, valor, dataVencimento, categoria, recorrente } = req.body;
        const conta = await database.addConta({
            descricao,
            valor: parseFloat(valor),
            dataVencimento,
            categoria,
            recorrente: recorrente || false,
            paga: false
        });
        res.json(conta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/contas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao, valor, dataVencimento, categoria, paga, recorrente } = req.body;
        const conta = await database.updateConta(id, {
            descricao,
            valor: parseFloat(valor),
            dataVencimento,
            categoria,
            paga: paga || false,
            recorrente: recorrente || false
        });
        res.json(conta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/contas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await database.deleteConta(id);
        res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/contas/:id/pagar', async (req, res) => {
    try {
        const { id } = req.params;
        const conta = await database.marcarComoPaga(id);
        res.json(conta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/contas/vencendo', async (req, res) => {
    try {
        const contas = await database.getContasVencendo();
        res.json(contas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/configurar-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validar e-mail
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'E-mail inválido' });
        }
        
        // Atualizar configuração no .env ou banco de dados
        // Por enquanto, vamos apenas retornar sucesso
        console.log(`📧 E-mail de notificação configurado: ${email}`);
        
        res.json({ 
            success: true, 
            message: 'E-mail de notificação configurado com sucesso!',
            email: email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializar banco de dados e serviços
async function inicializar() {
    try {
        await database.init();
        await cronService.iniciar();
        console.log('✅ Banco de dados inicializado com sucesso');
        console.log('✅ Serviço de agendamento iniciado');
    } catch (error) {
        console.error('❌ Erro ao inicializar:', error);
    }
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    inicializar();
}); 