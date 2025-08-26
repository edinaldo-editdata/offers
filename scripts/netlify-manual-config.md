# 🌐 Configuração Manual no Netlify Dashboard

## 🎯 **Sua Situação Atual:**
- ✅ GitHub conectado ao Netlify
- ✅ Commit `4fab99a` enviado para GitHub
- ✅ Deploy automático já iniciado
- ⏳ Falta configurar variáveis de ambiente

---

## 📋 **Passo a Passo Manual (3 minutos)**

### **1. Acessar Dashboard Netlify**
1. **Abra:** https://app.netlify.com/
2. **Faça login** com sua conta
3. **Clique** no seu site "offers" ou "editdata-offers"

### **2. Ir para Environment Variables**
1. **Clique** em "Site Settings" (no menu lateral)
2. **Clique** em "Environment variables" (seção Build & deploy)
3. **Clique** em "Add variable"

### **3. Adicionar Cada Variável**

**Copie e cole exatamente estas 6 variáveis:**

#### **Variável 1:**
```
Variable name: NEXT_PUBLIC_EMAILJS_SERVICE_ID
Value: service_editdata_offers
```

#### **Variável 2:**
```
Variable name: NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
Value: template_quote_notification
```

#### **Variável 3:**
```
Variable name: NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID
Value: template_client_confirmation
```

#### **Variável 4:**
```
Variable name: NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
Value: [Cole aqui a Public Key do seu .env.local]
```

#### **Variável 5:**
```
Variable name: NEXT_PUBLIC_COMPANY_EMAIL
Value: edinaldobl@editdata.com.br
```

#### **Variável 6:**
```
Variable name: NEXT_PUBLIC_NETLIFY_FORM_NAME
Value: quote-requests
```

### **4. Forçar Novo Deploy**
1. **Vá para:** "Deploys" (no menu principal)
2. **Clique:** "Trigger deploy" → "Deploy site"
3. **Aguarde** ~2-3 minutos

---

## ⚡ **Resultado Esperado:**

### **✅ Após 3 minutos você terá:**
- 🌐 Site atualizado com latest code
- 📧 Sistema de email 100% funcional
- 📋 Netlify Forms capturando dados
- 🔔 Notificações automáticas ativas

### **🧪 Para Testar:**
1. **Acesse:** https://seu-site.netlify.app/orcamentos
2. **Preencha** um orçamento teste
3. **Verifique** email em edinaldobl@editdata.com.br
4. **Confirme** Forms no dashboard Netlify

---

## 🚨 **Se Algo Der Errado:**

### **Deploy falhou:**
- Vá em "Deploys" → "Failed deploy" → "Deploy log"
- Procure por erros vermelhos
- Geralmente são variáveis mal configuradas

### **Emails não chegam:**
- Verifique se todas as 6 variáveis estão corretas
- Confirme se a Public Key está sem espaços
- Teste primeiro localmente

### **Netlify Forms não aparece:**
- Aguarde 5-10 minutos após deploy
- Vá em "Forms" no dashboard
- O formulário "quote-requests" deve aparecer

---

## 📞 **Precisa de Ajuda Rápida?**

Se preferir que eu configure automaticamente:
1. Execute o script: `scripts\auto-deploy-netlify.bat`
2. Ou me diga e eu configuro via CLI

**🎯 Método mais rápido: Script automático!**