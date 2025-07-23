const { spawn } = require('child_process');
const path = require('path');
const moment = require('moment');

class PythonEmailService {
    constructor() {
        this.pythonScript = path.join(__dirname, '..', 'Enviar Gmail.py');
        this.fromEmail = 'jamar.rodrigo@outlook.com';
        this.toEmail = 'jamarestudo@gmail.com';
        this.password = 'Lacrimosa1!';
        
        // Caminho do Python no Windows
        this.pythonPath = 'C:\\Users\\rodri\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
    }

    async sendEmail(subject, htmlContent) {
        return new Promise((resolve, reject) => {
            try {
                // Criar script Python temporário com o conteúdo personalizado
                const pythonCode = this.generatePythonScript(subject, htmlContent);
                
                // Executar script Python com caminho específico
                const pythonProcess = spawn(this.pythonPath, ['-c', pythonCode]);
                
                let output = '';
                let errorOutput = '';

                pythonProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });

                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        console.log('📧 E-mail enviado com sucesso via Python:', output.trim());
                        resolve(true);
                    } else {
                        console.error('❌ Erro ao enviar e-mail via Python:', errorOutput);
                        reject(new Error(errorOutput));
                    }
                });

                pythonProcess.on('error', (error) => {
                    console.error('❌ Erro ao executar Python:', error.message);
                    reject(error);
                });

            } catch (error) {
                console.error('❌ Erro no serviço Python:', error.message);
                reject(error);
            }
        });
    }

    generatePythonScript(subject, htmlContent) {
        return `
import smtplib
import email.message

def enviar_email():
    corpo_email = """${htmlContent.replace(/"/g, '\\"')}"""

    msg = email.message.Message()
    msg['Subject'] = "${subject.replace(/"/g, '\\"')}"
    msg['From'] = '${this.fromEmail}'
    msg['To'] = '${this.toEmail}'
    password = '${this.password}'
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)

    try:
        s = smtplib.SMTP('smtp.gmail.com: 587')
        s.starttls()
        s.login(msg['From'], password)
        s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        print('Email enviado com sucesso')
        s.quit()
    except Exception as e:
        print(f'Erro: {str(e)}')
        exit(1)

if __name__ == "__main__":
    enviar_email()
        `;
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
        const subject = '🧪 Família Jamar - Teste Python (Enviar Gmail.py)';
        
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🧪 Família Jamar</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">Teste de Notificação por E-mail</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;">Usando Python (Enviar Gmail.py)</p>
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
                        <h3 style="margin-top: 0; color: #495057;">🐍 Configuração Python:</h3>
                        <ul style="color: #495057; margin: 0; padding-left: 20px;">
                            <li><strong>Script:</strong> Enviar Gmail.py</li>
                            <li><strong>De:</strong> jamar.rodrigo@outlook.com</li>
                            <li><strong>Para:</strong> jamarestudo@gmail.com</li>
                            <li><strong>Servidor:</strong> smtp.gmail.com:587</li>
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

module.exports = PythonEmailService; 