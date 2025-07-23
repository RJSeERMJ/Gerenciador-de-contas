import smtplib
import email.message

def enviar_email():
    print("Iniciando envio de e-mail via Outlook...")
    
    corpo_email = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🏠 Família Jamar</h1>
            <p style="margin: 10px 0 0 0;">Gerenciador de Contas</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🧪 Teste de E-mail</h2>
            
            <p style="color: #666; line-height: 1.6;">
                Este é um teste do sistema <strong>Família Jamar</strong> via Outlook.
            </p>
            
            <div style="background-color: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                    ✅ Se você recebeu este e-mail, o sistema está funcionando!
                </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                Sistema Família Jamar - Teste de E-mail<br>
                <strong>Data/Hora:</strong> """ + str(__import__('datetime').datetime.now().strftime('%d/%m/%Y %H:%M:%S')) + """
            </p>
        </div>
    </div>
    """

    msg = email.message.Message()
    msg['Subject'] = "🧪 Teste Outlook - Família Jamar"
    msg['From'] = 'jamar.rodrigo@outlook.com'
    msg['To'] = 'jamarestudo@gmail.com'
    password = 'Lacrimosa1!'
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)

    try:
        print("Conectando ao servidor SMTP do Outlook...")
        s = smtplib.SMTP('smtp-mail.outlook.com: 587')
        print("Iniciando TLS...")
        s.starttls()
        print("Fazendo login...")
        s.login(msg['From'], password)
        print("Enviando e-mail...")
        s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        print('✅ Email enviado com sucesso via Outlook!')
        s.quit()
    except Exception as e:
        print(f'❌ Erro ao enviar e-mail: {str(e)}')

if __name__ == "__main__":
    enviar_email() 