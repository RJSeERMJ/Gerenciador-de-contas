const nodemailer = require('nodemailer');

// Configurações de e-mail com a senha fornecida
const emailConfigs = {
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamarestudo@gmail.com',
            pass: 'mekz ihei gvuz fkgb' // Senha de aplicativo fornecida
        }
    }
};

async function testarSenha() {
    console.log('🧪 TESTE COM SENHA FORNECIDA - Sistema Família Jamar');
    console.log('==================================================');
    
    try {
        console.log('📧 Configuração atual:');
        console.log('- Host:', emailConfigs.gmail.host);
        console.log('- Port:', emailConfigs.gmail.port);
        console.log('- User:', emailConfigs.gmail.auth.user);
        console.log('- Pass: ***CONFIGURADA***');
        
        console.log('\n🔍 Testando conexão com Gmail...');
        const transporter = nodemailer.createTransport(emailConfigs.gmail);
        
        // Verificar conexão
        await transporter.verify();
        console.log('✅ Conexão com Gmail OK!');
        
        // Testar envio
        console.log('\n📤 Testando envio de e-mail...');
        const result = await transporter.sendMail({
            from: 'jamarestudo@gmail.com',
            to: 'jamarestudo@gmail.com', // Enviando para o mesmo e-mail
            subject: 'Teste - Sistema Família Jamar',
            html: `
                <h2>🧪 Teste de E-mail</h2>
                <p>Este é um teste do sistema de e-mail do Sistema Família Jamar.</p>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p><strong>Status:</strong> ✅ Funcionando!</p>
                <p><strong>Senha:</strong> Configurada corretamente</p>
            `
        });
        
        console.log('✅ E-mail de teste enviado com sucesso!');
        console.log('📧 Message ID:', result.messageId);
        console.log('\n🎊 Sistema de e-mail funcionando perfeitamente!');
        console.log('\n💡 Agora configure no Vercel:');
        console.log('1. Vá para: https://vercel.com/dashboard');
        console.log('2. Seu projeto > Settings > Environment Variables');
        console.log('3. Adicione: EMAIL_PASSWORD = mekz ihei gvuz fkgb');
        
    } catch (error) {
        console.log('\n❌ ERRO no teste de e-mail:');
        console.log('- Mensagem:', error.message);
        console.log('- Código:', error.code);
        
        if (error.code === 'EAUTH') {
            console.log('\n💡 SOLUÇÃO:');
            console.log('1. Verifique se a verificação em duas etapas está ativa');
            console.log('2. Gere uma nova senha de aplicativo');
            console.log('3. Use a nova senha');
        }
    }
}

// Executar teste
testarSenha(); 