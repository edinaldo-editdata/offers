# 🌐 Configuração Rápida - Netlify Environment Variables

## 📋 **Comandos para Configurar no Netlify Dashboard**

Acesse: **Dashboard Netlify → Seu Site → Site Settings → Environment Variables**

### **Clique "Add variable" para cada uma:**

```bash
# 1. Service ID do EmailJS
Variable name: NEXT_PUBLIC_EMAILJS_SERVICE_ID
Value: service_editdata_offers

# 2. Template de Notificação
Variable name: NEXT_PUBLIC_EMAILJS_TEMPLATE_ID  
Value: template_quote_notification

# 3. Template de Confirmação
Variable name: NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID
Value: template_client_confirmation

# 4. Public Key (copie do EmailJS)
Variable name: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
Value: [Cole sua Public Key aqui]

# 5. Email da Empresa
Variable name: NEXT_PUBLIC_COMPANY_EMAIL
Value: edinaldobl@editdata.com.br

# 6. Nome do Formulário Netlify
Variable name: NEXT_PUBLIC_NETLIFY_FORM_NAME
Value: quote-requests
```

## 🚀 **Ou use a Netlify CLI (se preferir):**

```bash
# Instalar Netlify CLI (se ainda não tiver)
npm install -g netlify-cli

# Fazer login
netlify login

# Configurar variáveis (no diretório do projeto)
netlify env:set NEXT_PUBLIC_EMAILJS_SERVICE_ID service_editdata_offers
netlify env:set NEXT_PUBLIC_EMAILJS_TEMPLATE_ID template_quote_notification
netlify env:set NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID template_client_confirmation
netlify env:set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY "sua_public_key_aqui"
netlify env:set NEXT_PUBLIC_COMPANY_EMAIL edinaldobl@editdata.com.br
netlify env:set NEXT_PUBLIC_NETLIFY_FORM_NAME quote-requests

# Verificar se foram configuradas
netlify env:list
```

## ✅ **Após Configurar:**

1. **Fazer um novo deploy:**
   ```bash
   git add .
   git commit -m "Configurar variáveis de ambiente EmailJS"
   git push origin main
   ```

2. **Ou forçar rebuild no Netlify:**
   - Dashboard → Deploys → "Trigger deploy" → "Deploy site"

## 🎯 **Resultado Esperado:**

- ✅ Formulário envia emails automaticamente
- ✅ Empresa recebe notificação
- ✅ Cliente recebe confirmação
- ✅ Backup via Netlify Forms ativo
- ✅ Interface mostra status dos emails

## 🔧 **Solução de Problemas:**

### **Se emails não chegarem:**
1. Verifique se as variáveis estão corretas
2. Confirme se o serviço EmailJS está ativo
3. Teste primeiro localmente
4. Verifique console do navegador para erros

### **Se Netlify Forms não aparecer:**
1. Aguarde alguns minutos após deploy
2. Acesse: Site Settings → Forms
3. O formulário "quote-requests" deve aparecer