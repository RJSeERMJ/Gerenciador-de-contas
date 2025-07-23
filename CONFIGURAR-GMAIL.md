# 📧 **CONFIGURAR GMAIL PARA ENVIO DE E-MAIL**

## 🎯 **Problema:**
O Gmail não aceita mais senhas normais para aplicativos. É necessário criar uma **senha de aplicativo**.

## ✅ **SOLUÇÃO PASSO A PASSO:**

### **1. Ativar Verificação em Duas Etapas:**
1. Acesse: https://myaccount.google.com/
2. Clique em **"Segurança"**
3. Em **"Como você faz login no Google"**, clique em **"Verificação em duas etapas"**
4. Ative a verificação em duas etapas

### **2. Criar Senha de Aplicativo:**
1. Ainda em **"Segurança"**
2. Clique em **"Senhas de app"**
3. Selecione **"Aplicativo"** → **"Outro (nome personalizado)"**
4. Digite: **"Família Jamar"**
5. Clique em **"Gerar"**
6. **Copie a senha** gerada (16 caracteres)

### **3. Atualizar o Código:**
Edite o arquivo `server-simples.js` na linha 22:

```javascript
auth: {
    user: 'jamarestudo@gmail.com',
    pass: '49912170' // Senha atual
}
```

### **4. Testar:**
```bash
node server-simples.js
```

---

## 🔧 **CONFIGURAÇÃO ATUAL:**

### **Gmail:**
- **E-mail:** jamarestudo@gmail.com
- **Senha:** 49912170 (precisa ser senha de aplicativo)
- **Servidor:** smtp.gmail.com:587

### **Python (Fallback):**
- **E-mail:** jamarestudo@gmail.com
- **Senha:** 49912170 (precisa ser senha de aplicativo)
- **Servidor:** smtp.gmail.com:587

---

## 🧪 **TESTE RÁPIDO:**

### **1. Criar arquivo de teste:**
```python
# teste-gmail.py
import smtplib
import email.message

def enviar_email():
    corpo_email = """
    <h2>Teste Gmail</h2>
    <p>Se você recebeu este e-mail, o Gmail está funcionando!</p>
    """

    msg = email.message.Message()
    msg['Subject'] = "Teste Gmail - Família Jamar"
    msg['From'] = 'jamarestudo@gmail.com'
    msg['To'] = 'jamarestudo@gmail.com'
    password = '49912170'  # Senha atual
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)

    try:
        s = smtplib.SMTP('smtp.gmail.com: 587')
        s.starttls()
        s.login(msg['From'], password)
        s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
        print('✅ Email enviado com sucesso!')
        s.quit()
    except Exception as e:
        print(f'❌ Erro: {str(e)}')

if __name__ == "__main__":
    enviar_email()
```

### **2. Executar teste:**
```bash
python teste-gmail.py
```

---

## 🎉 **RESULTADO ESPERADO:**

### **✅ Sucesso:**
- E-mail enviado via Gmail
- Confirmação no console
- E-mail chega na caixa de entrada

### **❌ Se falhar:**
- Verificar se a verificação em duas etapas está ativa
- Verificar se a senha de aplicativo está correta
- Verificar se o e-mail está correto

---

## 🚀 **PRÓXIMOS PASSOS:**

1. **Configure** a senha de aplicativo do Gmail
2. **Atualize** o código com a nova senha
3. **Teste** o envio
4. **Use** o sistema normalmente

---

**🎊 Com a senha de aplicativo configurada, o Gmail funcionará perfeitamente!** 