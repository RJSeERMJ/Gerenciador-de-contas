const nodemailer = require('nodemailer');

// Configurações de e-mail
const emailConfigs = {
    outlook: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamar.rodrigo@outlook.com',
            pass: 'Lacrimosa1!'
        }
    },
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jamar.rodrigo@outlook.com',
            pass: 'Lacrimosa1!'
        }
    }
};

// Função para testar envio de e-mail
async function testarEmail() {
    const destinatario = 'jamarestudo@gmail.com';
    const assunto = '🧪 Teste de E-mail - Família Jamar';
    const conteudo = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4CAF50;">🧪 Teste de E-mail</h2>
            <p>Este é um teste do sistema Família Jamar.</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p>Se você recebeu este e-mail, o sistema está funcionando corretamente!</p>
        </div>
    `;

    console.log('🧪 Iniciando teste de e-mail...');
    console.log(`📧 Destinatário: ${destinatario}`);

    // Tentar Outlook primeiro
    try {
        console.log('\n📧 Tentando enviar via Outlook...');
        const transporter = nodemailer.createTransport(emailConfigs.outlook);
        
        const mailOptions = {
            from: `"Família Jamar" <${emailConfigs.outlook.auth.user}>`,
            to: destinatario,
            subject: assunto,
            html: conteudo
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ E-mail enviado com sucesso via Outlook: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao enviar via Outlook:', error.message);
        
        // Se Outlook falhar, tentar Gmail
        try {
            console.log('\n📧 Tentando enviar via Gmail...');
            const transporter = nodemailer.createTransport(emailConfigs.gmail);
            
            const mailOptions = {
                from: `"Família Jamar" <${emailConfigs.gmail.auth.user}>`,
                to: destinatario,
                subject: assunto,
                html: conteudo
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ E-mail enviado com sucesso via Gmail: ${info.messageId}`);
            return true;
        } catch (gmailError) {
            console.error('❌ Erro ao enviar via Gmail:', gmailError.message);
            return false;
        }
    }
}

// Executar teste
testarEmail().then(sucesso => {
    if (sucesso) {
        console.log('\n🎉 Teste concluído com sucesso!');
        console.log('📧 Verifique sua caixa de entrada.');
    } else {
        console.log('\n❌ Teste falhou. Verifique as configurações.');
    }
    process.exit(0);
}).catch(error => {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
}); 