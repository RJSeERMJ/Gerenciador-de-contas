const nodemailer = require('nodemailer');

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

async function testarEmail() {
    console.log('🧪 TESTE DE E-MAIL - Sistema Família Jamar');
    console.log('==========================================');
    
    try {
        console.log('📧 Configuração atual:');
        console.log('- Host:', emailConfigs.gmail.host);
        console.log('- Port:', emailConfigs.gmail.port);
        console.log('- User:', emailConfigs.gmail.auth.user);
        console.log('- Pass:', process.env.EMAIL_PASSWORD ? '***CONFIGURADA***' : '***NÃO CONFIGURADA***');
        
        if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'sua_senha_aqui') {
            console.log('\n❌ ERRO: Senha de e-mail não configurada!');
            console.log('💡 Para configurar:');
            console.log('1. Crie uma senha de aplicativo no Gmail');
            console.log('2. Configure a variável EMAIL_PASSWORD no Vercel');
            console.log('3. Ou crie um arquivo .env com: EMAIL_PASSWORD=sua_senha');
            return;
        }
        
        console.log('\n🔍 Testando conexão com Gmail...');
        const transporter = nodemailer.createTransporter(emailConfigs.gmail);
        
        // Verificar conexão
        await transporter.verify();
        console.log('✅ Conexão com Gmail OK!');
        
        // Testar envio
        console.log('\n📤 Testando envio de e-mail...');
        const result = await transporter.sendMail({
            from: 'jamarestudo@gmail.com',
            to: 'teste@exemplo.com', // Substitua por um e-mail real
            subject: 'Teste - Sistema Família Jamar',
            html: `
                <h2>🧪 Teste de E-mail</h2>
                <p>Este é um teste do sistema de e-mail do Sistema Família Jamar.</p>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p><strong>Status:</strong> ✅ Funcionando!</p>
            `
        });
        
        console.log('✅ E-mail de teste enviado com sucesso!');
        console.log('📧 Message ID:', result.messageId);
        console.log('\n🎊 Sistema de e-mail funcionando perfeitamente!');
        
    } catch (error) {
        console.log('\n❌ ERRO no teste de e-mail:');
        console.log('- Mensagem:', error.message);
        console.log('- Código:', error.code);
        
        if (error.code === 'EAUTH') {
            console.log('\n💡 SOLUÇÃO:');
            console.log('1. Acesse: https://myaccount.google.com/');
            console.log('2. Vá em "Segurança" > "Senhas de app"');
            console.log('3. Gere uma senha para "Sistema Família Jamar"');
            console.log('4. Use essa senha no Vercel (não a senha normal)');
        }
    }
}

// Executar teste
testarEmail(); 