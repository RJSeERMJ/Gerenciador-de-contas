const twilio = require('twilio');
const axios = require('axios');
const moment = require('moment');
const EmailService = require('./emailService');
const PythonEmailService = require('./pythonEmailService');

class NotificationService {
    constructor() {
        // Configurar Twilio para SMS (apenas se as credenciais existirem)
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.twilioClient = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
        } else {
            this.twilioClient = null;
            console.log('⚠️ Twilio não configurado - SMS desabilitado');
        }
        
        this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        this.seuTelefone = process.env.SEU_TELEFONE;
        
        // Configurar WhatsApp Business API (apenas se as credenciais existirem)
        this.whatsappToken = process.env.WHATSAPP_TOKEN;
        this.whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;
        this.whatsappBusinessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
        
        if (!this.whatsappToken || !this.whatsappPhoneId) {
            console.log('⚠️ WhatsApp não configurado - WhatsApp desabilitado');
        }

        // Configurar serviço de e-mail
        this.emailService = new EmailService();
        
        // Configurar serviço de e-mail Python
        this.pythonEmailService = new PythonEmailService();
    }

    async enviarSMS(mensagem) {
        try {
            if (!this.twilioClient || !this.seuTelefone) {
                throw new Error('Configurações do Twilio não encontradas');
            }

            const message = await this.twilioClient.messages.create({
                body: mensagem,
                from: this.twilioPhoneNumber,
                to: this.seuTelefone
            });

            console.log(`✅ SMS enviado com sucesso: ${message.sid}`);
            return `SMS enviado: ${message.sid}`;
        } catch (error) {
            console.error('❌ Erro ao enviar SMS:', error.message);
            throw error;
        }
    }

    async enviarWhatsApp(mensagem) {
        try {
            if (!this.whatsappToken || !this.whatsappPhoneId) {
                throw new Error('Configurações do WhatsApp não encontradas');
            }

            const url = `https://graph.facebook.com/v18.0/${this.whatsappPhoneId}/messages`;
            
            const response = await axios.post(url, {
                messaging_product: 'whatsapp',
                to: this.seuTelefone,
                type: 'text',
                text: {
                    body: mensagem
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${this.whatsappToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(`✅ WhatsApp enviado com sucesso: ${response.data.messages[0].id}`);
            return `WhatsApp enviado: ${response.data.messages[0].id}`;
        } catch (error) {
            console.error('❌ Erro ao enviar WhatsApp:', error.response?.data || error.message);
            throw error;
        }
    }

    async enviarNotificacaoContasVencendo(contas) {
        if (contas.length === 0) return;

        const mensagem = this.criarMensagemContasVencendo(contas);
        
        try {
            // Enviar por SMS
            await this.enviarSMS(mensagem);
        } catch (error) {
            console.error('Falha ao enviar SMS, tentando WhatsApp...');
        }

        try {
            // Enviar por WhatsApp
            await this.enviarWhatsApp(mensagem);
        } catch (error) {
            console.error('Falha ao enviar WhatsApp');
        }

        try {
            // Enviar por e-mail (Node.js)
            await this.emailService.sendContasVencendo(contas);
        } catch (error) {
            console.error('Falha ao enviar e-mail via Node.js, tentando Python...');
            try {
                // Enviar por e-mail (Python)
                await this.pythonEmailService.sendContasVencendo(contas);
            } catch (pythonError) {
                console.error('Falha ao enviar e-mail via Python:', pythonError.message);
            }
        }
    }

    async enviarNotificacaoContasVencidas(contas) {
        if (contas.length === 0) return;

        const mensagem = this.criarMensagemContasVencidas(contas);
        
        try {
            await this.enviarSMS(mensagem);
        } catch (error) {
            console.error('Falha ao enviar SMS de contas vencidas');
        }

        try {
            await this.enviarWhatsApp(mensagem);
        } catch (error) {
            console.error('Falha ao enviar WhatsApp de contas vencidas');
        }

        try {
            // Enviar por e-mail (Node.js)
            await this.emailService.sendContasVencidas(contas);
        } catch (error) {
            console.error('Falha ao enviar e-mail via Node.js, tentando Python...');
            try {
                // Enviar por e-mail (Python)
                await this.pythonEmailService.sendContasVencidas(contas);
            } catch (pythonError) {
                console.error('Falha ao enviar e-mail via Python:', pythonError.message);
            }
        }
    }

    criarMensagemContasVencendo(contas) {
        let mensagem = '💰 LEMBRETE DE CONTAS\n\n';
        mensagem += 'As seguintes contas vencem nos próximos dias:\n\n';
        
        contas.forEach(conta => {
            const dataFormatada = moment(conta.dataVencimento).format('DD/MM/YYYY');
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(conta.valor);
            
            mensagem += `📅 ${conta.descricao}\n`;
            mensagem += `   💵 ${valorFormatado}\n`;
            mensagem += `   📆 Vence em: ${dataFormatada}\n\n`;
        });
        
        mensagem += '⚠️ Não esqueça de pagar!';
        return mensagem;
    }

    criarMensagemContasVencidas(contas) {
        let mensagem = '🚨 URGENTE - CONTAS VENCIDAS\n\n';
        mensagem += 'As seguintes contas estão vencidas:\n\n';
        
        contas.forEach(conta => {
            const dataFormatada = moment(conta.dataVencimento).format('DD/MM/YYYY');
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(conta.valor);
            
            mensagem += `📅 ${conta.descricao}\n`;
            mensagem += `   💵 ${valorFormatado}\n`;
            mensagem += `   📆 Venceu em: ${dataFormatada}\n\n`;
        });
        
        mensagem += '🚨 PAGUE IMEDIATAMENTE!';
        return mensagem;
    }

    async enviarNotificacaoTeste(tipo) {
        const mensagemTeste = '🧪 TESTE DE NOTIFICAÇÃO\n\nEste é um teste do seu gerenciador de contas!\n\n✅ Sistema funcionando corretamente.';
        
        if (tipo === 'sms') {
            return await this.enviarSMS(mensagemTeste);
        } else if (tipo === 'whatsapp') {
            return await this.enviarWhatsApp(mensagemTeste);
        } else if (tipo === 'email') {
            try {
                // Tentar Node.js primeiro
                return await this.emailService.sendTestEmail();
            } catch (error) {
                console.log('Node.js falhou, tentando Python...');
                // Tentar Python como backup
                return await this.pythonEmailService.sendTestEmail();
            }
        } else if (tipo === 'python') {
            return await this.pythonEmailService.sendTestEmail();
        } else {
            throw new Error('Tipo de notificação inválido. Use "sms", "whatsapp", "email" ou "python"');
        }
    }
}

module.exports = new NotificationService(); 