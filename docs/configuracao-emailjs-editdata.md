# 🎯 Configuração PersonalizadEmailJS - EditData

## 📧 **Sua Conta de Email:** edinaldobl@editdata.com.br

## 🚀 **Passo a Passo Simplificado**

### **Etapa 1: Criar Conta no EmailJS**
1. **Acesse:** https://www.emailjs.com/
2. **Clique:** "Sign Up"
3. **Use seu email:** edinaldobl@editdata.com.br
4. **Confirme** o email de verificação

---

### **Etapa 2: Configurar Serviço Gmail**
1. **No dashboard, vá para:** "Email Services"
2. **Clique:** "Add New Service"
3. **Escolha:** "Gmail"
4. **Configure:**
   - **Service ID:** `service_editdata_offers`
   - **Email:** edinaldobl@editdata.com.br
   - **Autorize** o acesso ao Gmail

---

### **Etapa 3: Criar Templates**

#### **Template 1: Notificação para Empresa**
- **Template ID:** `template_quote_notification`
- **Nome:** "Nova Solicitação de Orçamento - EditData"
- **Para:** edinaldobl@editdata.com.br
- **Assunto:** `Nova Solicitação: {{client_name}} - {{project_type}}`

#### **Template 2: Confirmação para Cliente**  
- **Template ID:** `template_client_confirmation`
- **Nome:** "Confirmação de Recebimento - EditData"
- **Para:** {{client_email}}
- **Assunto:** `✅ Orçamento Recebido - {{client_name}}`

---

### **Etapa 4: Copiar Chaves**

#### **📋 Locais das Informações:**

| **Informação** | **Local no EmailJS** | **Variável no .env.local** |
|----------------|----------------------|----------------------------|
| **Public Key** | Account → General | `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` |
| **Service ID** | Email Services | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` |
| **Template ID 1** | Email Templates | `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` |
| **Template ID 2** | Email Templates | `NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID` |

---

## 🔑 **Arquivo .env.local Configurado**

Já configurei o arquivo com os IDs sugeridos. Você só precisa:

1. **Copiar a Public Key** do EmailJS
2. **Colar** em `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
3. **Verificar** se os IDs dos templates conferem

**Localização:** `c:\Users\edina\gscripts\EditData\Offers\.env.local`

---

## 🎨 **Templates Prontos para Usar**

### **Template de Notificação (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nova Solicitação - EditData</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .footer { background: #64748b; color: white; padding: 15px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Nova Solicitação de Orçamento</h1>
        <p>EditData Soluções Inteligentes</p>
    </div>
    
    <div class="content">
        <div class="highlight">
            <h2>Cliente: {{client_name}}</h2>
            <p><strong>Email:</strong> {{client_email}}</p>
            <p><strong>Telefone:</strong> {{client_phone}}</p>
            <p><strong>Empresa:</strong> {{company_name}}</p>
        </div>
        
        <h3>Projeto Solicitado:</h3>
        <p><strong>{{project_type}}</strong></p>
        
        <h3>Serviços:</h3>
        <p>{{services}}</p>
        
        <h3>Descrição:</h3>
        <p>{{description}}</p>
        
        <h3>Detalhes:</h3>
        <p><strong>Urgência:</strong> {{urgency}}</p>
        <p><strong>Orçamento:</strong> {{budget}}</p>
        <p><strong>Prazo:</strong> {{deadline}}</p>
        
        {{#if additional_info}}
        <h3>Informações Adicionais:</h3>
        <p>{{additional_info}}</p>
        {{/if}}
    </div>
    
    <div class="footer">
        <p><strong>Recebido em:</strong> {{created_at}}</p>
        <p>📧 Sistema de Orçamentos EditData</p>
    </div>
</body>
</html>
```

### **Template de Confirmação (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirmação - EditData</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f0fdf4; padding: 20px; border: 1px solid #bbf7d0; }
        .highlight { background: #dcfce7; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e; }
        .footer { background: #059669; color: white; padding: 15px; border-radius: 0 0 8px 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Orçamento Recebido!</h1>
        <p>EditData Soluções Inteligentes</p>
    </div>
    
    <div class="content">
        <h2>Olá, {{client_name}}!</h2>
        
        <div class="highlight">
            <h3>🎉 Sua solicitação foi recebida!</h3>
            <p>Projeto: <strong>{{project_type}}</strong></p>
            <p>Recebido em: {{created_at}}</p>
        </div>
        
        <h3>📋 Próximos Passos:</h3>
        <ol>
            <li><strong>Análise Técnica</strong> - Nossa equipe analisará seu projeto (2-4 horas)</li>
            <li><strong>Orçamento Personalizado</strong> - Prepararemos uma proposta detalhada</li>
            <li><strong>Contato Direto</strong> - Entraremos em contato em até 24 horas</li>
        </ol>
        
        <div class="highlight">
            <p><strong>📞 Precisa de contato imediato?</strong></p>
            <p>Email: edinaldobl@editdata.com.br</p>
            <p>Referência: #{{request_id}}</p>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>Obrigado por escolher a EditData!</strong></p>
        <p>📧 edinaldobl@editdata.com.br</p>
    </div>
</body>
</html>
```

---

## ⚡ **Teste Rápido**

Após configurar:

```bash
# 1. Testar localmente
npm run dev

# 2. Acessar
http://localhost:3000/orcamentos

# 3. Preencher e enviar um teste
```

---

## 🌐 **Configuração no Netlify**

**Local:** Dashboard Netlify → Site Settings → Environment Variables

Adicione as mesmas variáveis do `.env.local`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | service_editdata_offers |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | template_quote_notification |
| `NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID` | template_client_confirmation |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | [Sua Public Key] |
| `NEXT_PUBLIC_COMPANY_EMAIL` | edinaldobl@editdata.com.br |

---

## ✅ **Checklist de Configuração**

- [ ] Conta EmailJS criada
- [ ] Serviço Gmail conectado
- [ ] Template de notificação criado
- [ ] Template de confirmação criado
- [ ] Public Key copiada para .env.local
- [ ] Teste local realizado
- [ ] Variáveis configuradas no Netlify
- [ ] Teste em produção realizado

---

**🚀 Pronto! Sistema de email configurado para a EditData!**