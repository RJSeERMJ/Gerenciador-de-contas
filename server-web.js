const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta Família Jamar
app.use(express.static(path.join(__dirname, 'Família Jamar - Sistema Completo', 'public')));

// Armazenamento em memória (para Vercel)
let contas = [];
let nextId = 1;

// Configurações de e-mail
const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com',
            pass: process.env.EMAIL_PASSWORD || 'sua_senha_aqui'
        }
    }
};

// Função para enviar e-mail
async function enviarEmail(destinatario, assunto, conteudo) {
    try {
        const transporter = nodemailer.createTransporter(emailConfigs.gmail);
        await transporter.sendMail({
            from: 'jamarestudo@gmail.com',
            to: destinatario,
            subject: assunto,
            html: conteudo
        });
        console.log('✅ E-mail enviado com sucesso');
        return true;
    } catch (error) {
        console.log('❌ Erro ao enviar e-mail:', error.message);
        return false;
    }
}

// Rotas da API
app.get('/api/contas', (req, res) => {
    res.json(contas);
});

app.post('/api/contas', (req, res) => {
    const novaConta = {
        id: nextId++,
        descricao: req.body.descricao,
        valor: req.body.valor,
        dataVencimento: req.body.dataVencimento,
        categoria: req.body.categoria || 'Outros',
        recorrente: req.body.recorrente || false,
        paga: false,
        dataCriacao: new Date().toISOString()
    };
    
    contas.push(novaConta);
    res.json(novaConta);
});

app.put('/api/contas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = contas.findIndex(conta => conta.id === id);
    
    if (index !== -1) {
        contas[index] = { ...contas[index], ...req.body };
        res.json(contas[index]);
    } else {
        res.status(404).json({ error: 'Conta não encontrada' });
    }
});

app.delete('/api/contas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = contas.findIndex(conta => conta.id === id);
    
    if (index !== -1) {
        contas.splice(index, 1);
        res.json({ message: 'Conta deletada com sucesso' });
    } else {
        res.status(404).json({ error: 'Conta não encontrada' });
    }
});

app.patch('/api/contas/:id/pagar', (req, res) => {
    const id = parseInt(req.params.id);
    const conta = contas.find(c => c.id === id);
    
    if (conta) {
        conta.paga = true;
        conta.dataPagamento = new Date().toISOString();
        res.json(conta);
    } else {
        res.status(404).json({ error: 'Conta não encontrada' });
    }
});

// Rota para enviar e-mail
app.post('/api/enviar-email', async (req, res) => {
    const { destinatario, assunto, conteudo } = req.body;
    
    try {
        const sucesso = await enviarEmail(destinatario, assunto, conteudo);
        if (sucesso) {
            res.json({ message: 'E-mail enviado com sucesso' });
        } else {
            res.status(500).json({ error: 'Erro ao enviar e-mail' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para estatísticas
app.get('/api/estatisticas', (req, res) => {
    const hoje = new Date();
    const contasVencidas = contas.filter(conta => 
        !conta.paga && new Date(conta.dataVencimento) < hoje
    );
    const contasPendentes = contas.filter(conta => 
        !conta.paga && new Date(conta.dataVencimento) >= hoje
    );
    const contasPagas = contas.filter(conta => conta.paga);
    
    const totalPendente = contasPendentes.reduce((sum, conta) => 
        sum + parseFloat(conta.valor), 0
    );
    const totalVencido = contasVencidas.reduce((sum, conta) => 
        sum + parseFloat(conta.valor), 0
    );
    
    res.json({
        total: contas.length,
        pendentes: contasPendentes.length,
        vencidas: contasVencidas.length,
        pagas: contasPagas.length,
        totalPendente: totalPendente.toFixed(2),
        totalVencido: totalVencido.toFixed(2)
    });
});

// Rota principal - usar o index.html da Família Jamar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Família Jamar - Sistema Completo', 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Sistema Família Jamar online!`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

module.exports = app; 