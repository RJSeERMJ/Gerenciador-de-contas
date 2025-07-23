const nodemailer = require('nodemailer');
const moment = require('moment');

class EmailService {
    constructor() {
        this.transporter = null;
        this.backupTransporter = null;
        this.fromEmail = process.env.EMAIL_FROM;
        this.toEmail = process.env.EMAIL_TO;
        
        // Configurar transportadores de e-mail
        this.setupTransporters();
    }

    setupTransporters() {
        // Configurar Gmail (principal)
        this.setupGmailTransporter();
        
        // Configurar Outlook (backup)
        this.setupOutlookTransporter();
    }

    setupGmailTransporter() {
        // Verificar se as credenciais do Gmail estão configuradas
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Gmail não configurado - Notificações por e-mail desabilitadas');
            return;
        }

        try {
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT || 587,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            console.log('✅ Serviço de e-mail (Gmail) configurado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao configurar Gmail:', error.message);
            this.transporter = null;
        }
    }

    setupOutlookTransporter() {
        // Configurações do Outlook como backup
        const outlookConfig = {
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: 'jamar.rodrigo@outlook.com',
                pass: process.env.OUTLOOK_APP_PASSWORD || 'Lacrimosa1!' // Usar senha de aplicativo se disponível
            }
        };

        try {
            this.backupTransporter = nodemailer.createTransport(outlookConfig);
            console.log('✅ Serviço de e-mail (Outlook) configurado como backup');
        } catch (error) {
            console.error('❌ Erro ao configurar Outlook:', error.message);
            this.backupTransporter = null;
        }
    }

    async sendEmail(subject, htmlContent) {
        if (!this.transporter && !this.backupTransporter) {
            console.log('⚠️ Nenhum serviço de e-mail configurado - Não foi possível enviar notificação');
            return false;
        }

        // Tentar Gmail primeiro
        if (this.transporter) {
            try {
                const mailOptions = {
                    from: `"Família Jamar" <${this.fromEmail}>`,
                    to: this.toEmail,
                    subject: subject,
                    html: htmlContent
                };

                const info = await this.transporter.sendMail(mailOptions);
                console.log('📧 E-mail enviado com sucesso via Gmail:', info.messageId);
                return true;
            } catch (error) {
                console.error('❌ Erro ao enviar via Gmail:', error.message);
                console.log('🔄 Tentando Outlook como backup...');
            }
        }

        // Se Gmail falhou, tentar Outlook
        if (this.backupTransporter) {
            try {
                const mailOptions = {
                    from: `"Família Jamar" <jamar.rodrigo@outlook.com>`,
                    to: this.toEmail,
                    subject: subject,
                    html: htmlContent
                };

                const info = await this.backupTransporter.sendMail(mailOptions);
                console.log('📧 E-mail enviado com sucesso via Outlook:', info.messageId);
                return true;
            } catch (error) {
                console.error('❌ Erro ao enviar via Outlook:', error.message);
                return false;
            }
        }

        return false;
    }

    async sendContasVencendo(contas) {
        if (!contas || contas.length === 0) return;

        const subject = `🏠 Família Jamar - Contas Vencendo (${contas.length} conta${contas.length > 1 ? 's' : ''})`;
        
        let htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🏠 Família Jamar</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">Gerenciador de Contas</p>
                </div>
                
                <div style="background: white; padding: 20px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #ff6b35; margin-top: 0;">⚠️ Contas Vencendo</h2>
                    <p style="color: #666; margin-bottom: 20px;">Você tem <strong>${contas.length} conta${contas.length > 1 ? 's' : ''}</strong> vencendo em breve:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Conta</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Valor</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Vencimento</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Dias</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        contas.forEach(conta => {
            const vencimento = moment(conta.dataVencimento);
            const hoje = moment();
            const diasRestantes = vencimento.diff(hoje, 'days');
            
            htmlContent += `
                <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 12px; font-weight: 500;">${conta.descricao}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 500; color: #dc3545;">R$ ${parseFloat(conta.valor).toFixed(2)}</td>
                    <td style="padding: 12px; text-align: center;">${vencimento.format('DD/MM/YYYY')}</td>
                    <td style="padding: 12px; text-align: center; color: ${diasRestantes <= 1 ? '#dc3545' : '#ffc107'}; font-weight: 500;">
                        ${diasRestantes === 0 ? 'Hoje' : diasRestantes === 1 ? 'Amanhã' : `${diasRestantes} dias`}
                    </td>
                </tr>
            `;
        });

        htmlContent += `
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
                        <p style="margin: 0; color: #856404;">
                            💡 <strong>Dica:</strong> Não esqueça de pagar essas contas para evitar juros e multas!
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>Este e-mail foi enviado automaticamente pelo sistema Família Jamar</p>
                    <p>Data: ${moment().format('DD/MM/YYYY HH:mm')}</p>
                </div>
            </div>
        `;

        return await this.sendEmail(subject, htmlContent);
    }

    async sendContasVencidas(contas) {
        if (!contas || contas.length === 0) return;

        const subject = `🚨 Família Jamar - CONTAS VENCIDAS (${contas.length} conta${contas.length > 1 ? 's' : ''})`;
        
        let htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🚨 Família Jamar</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">ALERTA - Contas Vencidas</p>
                </div>
                
                <div style="background: white; padding: 20px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545; margin-top: 0;">🚨 CONTAS VENCIDAS</h2>
                    <p style="color: #666; margin-bottom: 20px;">Você tem <strong>${contas.length} conta${contas.length > 1 ? 's' : ''}</strong> vencida${contas.length > 1 ? 's' : ''}:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Conta</th>
                                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">Valor</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Vencimento</th>
                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Dias</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        contas.forEach(conta => {
            const vencimento = moment(conta.dataVencimento);
            const hoje = moment();
            const diasVencida = hoje.diff(vencimento, 'days');
            
            htmlContent += `
                <tr style="border-bottom: 1px solid #dee2e6;">
                    <td style="padding: 12px; font-weight: 500;">${conta.descricao}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 500; color: #dc3545;">R$ ${parseFloat(conta.valor).toFixed(2)}</td>
                    <td style="padding: 12px; text-align: center;">${vencimento.format('DD/MM/YYYY')}</td>
                    <td style="padding: 12px; text-align: center; color: #dc3545; font-weight: 500;">
                        ${diasVencida === 1 ? '1 dia' : `${diasVencida} dias`} atrás
                    </td>
                </tr>
            `;
        });

        htmlContent += `
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
                        <p style="margin: 0; color: #721c24;">
                            ⚠️ <strong>URGENTE:</strong> Pague essas contas imediatamente para evitar juros e multas!
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>Este e-mail foi enviado automaticamente pelo sistema Família Jamar</p>
                    <p>Data: ${moment().format('DD/MM/YYYY HH:mm')}</p>
                </div>
            </div>
        `;

        return await this.sendEmail(subject, htmlContent);
    }

    async sendTestEmail() {
        const subject = '🧪 Família Jamar - Teste de Notificação por E-mail (Gmail + Outlook)';
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🧪 Família Jamar</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">Teste de Notificação por E-mail</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Gmail + Outlook (Backup)</p>
                </div>
                
                <div style="background: white; padding: 20px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #28a745; margin-top: 0;">✅ Teste Concluído</h2>
                    <p style="color: #666; margin-bottom: 20px;">O sistema de notificações por e-mail está funcionando corretamente!</p>
                    
                    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px;">
                        <p style="margin: 0; color: #155724;">
                            🎉 <strong>Sucesso!</strong> Você receberá notificações automáticas por e-mail quando houver contas vencendo ou vencidas.
                        </p>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #e2e3e5; border: 1px solid #d6d8db; border-radius: 5px;">
                        <h3 style="margin-top: 0; color: #495057;">📧 Configuração Dupla:</h3>
                        <ul style="color: #495057; margin: 0; padding-left: 20px;">
                            <li><strong>Gmail:</strong> Serviço principal (jamarestudo@gmail.com)</li>
                            <li><strong>Outlook:</strong> Serviço de backup (jamar.rodrigo@outlook.com)</li>
                            <li><strong>Destino:</strong> jamar.rodrigo@outlook.com</li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
                        <h3 style="margin-top: 0; color: #856404;">🕐 Horários das Notificações:</h3>
                        <ul style="color: #856404; margin: 0; padding-left: 20px;">
                            <li><strong>9h:</strong> Contas vencendo em 3 dias</li>
                            <li><strong>10h:</strong> Contas vencidas</li>
                            <li><strong>18h:</strong> Contas vencendo em 1 dia</li>
                        </ul>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>Este e-mail foi enviado automaticamente pelo sistema Família Jamar</p>
                    <p>Data: ${moment().format('DD/MM/YYYY HH:mm')}</p>
                </div>
            </div>
        `;

        return await this.sendEmail(subject, htmlContent);
    }
}

module.exports = EmailService; 