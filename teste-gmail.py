import smtplib
import email.message

def testar_senhas():
    senhas_para_testar = ['49912170', 'Lacrimosa1!', 'Lacrimosa', 'qyygmoapjizfviro']
    
    print("🔍 Testando senhas do Gmail automaticamente...")
    
    for i, senha in enumerate(senhas_para_testar):
        print(f"📧 Testando senha {i + 1}/{len(senhas_para_testar)}: {senha}")
        
        try:
            s = smtplib.SMTP('smtp.gmail.com: 587')
            s.starttls()
            s.login('jamarestudo@gmail.com', senha)
            print(f"✅ Senha funcionando: {senha}")
            s.quit()
            return senha
        except Exception as e:
            print(f"❌ Senha não funcionou: {senha}")
            if i == len(senhas_para_testar) - 1:
                print("❌ Nenhuma senha funcionou. Configure senha de aplicativo.")
                return None
    
    return None

def enviar_email():
    print("🧪 Iniciando teste de e-mail via Gmail...")
    
    # Testar senhas primeiro
    senha_funcionando = testar_senhas()
    
    if not senha_funcionando:
        print("❌ Nenhuma senha funcionou. Teste encerrado.")
        return
    
    corpo_email = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #4285f4; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🏠 Família Jamar</h1>
            <p style="margin: 10px 0 0 0;">Gerenciador de Contas</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">🧪 Teste de E-mail via Gmail</h2>
            
            <p style="color: #666; line-height: 1.6;">
                Este é um teste do sistema <strong>Família Jamar</strong> via Gmail.
            </p>
            
            <div style="background-color: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                    ✅ Se você recebeu este e-mail, o Gmail está funcionando perfeitamente!
                </p>
            </div>
            
            <h3 style="color: #333;">🔧 Configuração:</h3>
            <ul style="color: #666; line-height: 1.6;">
                <li><strong>Servidor:</strong> smtp.gmail.com:587</li>
                <li><strong>E-mail:</strong> jamarestudo@gmail.com</li>
                <li><strong>Senha:</strong> """ + senha_funcionando + """</li>
                <li><strong>Status:</strong> ✅ Funcionando</li>
            </ul>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
                Sistema Família Jamar - Teste Gmail<br>
                <strong>Data/Hora:</strong> """ + str(__import__('datetime').datetime.now().strftime('%d/%m/%Y %H:%M:%S')) + """
            </p>
        </div>
    </div>
    """

    msg = email.message.Message()
    msg['Subject'] = "🧪 Teste Gmail - Família Jamar"
    msg['From'] = 'jamarestudo@gmail.com'
    msg['To'] = 'jamarestudo@gmail.com'
    password = senha_funcionando
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)

    try:
        print("Conectando ao servidor SMTP do Gmail...")
        s = smtplib.SMTP('smtp.gmail.com: 587')
        print("Iniciando TLS...")
        s.starttls()
        print("Fazendo login...")
        s.login(msg['From'], password)
        print("Enviando e-mail...")
        s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        print('✅ Email enviado com sucesso via Gmail!')
        s.quit()
    except Exception as e:
        print(f'❌ Erro ao enviar e-mail: {str(e)}')
        print('\n💡 Para resolver:')
        print('1. Ative a verificação em duas etapas no Gmail')
        print('2. Crie uma senha de aplicativo')
        print('3. Substitua a senha no código')

if __name__ == "__main__":
    enviar_email() 