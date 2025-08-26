# 🔍 Verificar Variáveis de Ambiente no Netlify

## 1. Acesse o Dashboard do Netlify
1. Vá para https://app.netlify.com/
2. Clique no seu site "EditData Offers"
3. Vá em **Site Settings** → **Environment Variables**

## 2. Verificar se estas variáveis existem:
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` = `service_editdata_offers`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` = `template_quote_notification`
- `NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID` = `template_r3bds0a`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` = `yj42PJzyGOZpxcWk1`
- `NEXT_PUBLIC_COMPANY_EMAIL` = `contato@editdata.com.br`
- `NEXT_PUBLIC_NETLIFY_FORM_NAME` = `quote-requests`

## 3. Se alguma variável estiver faltando:
1. Clique em **Add Variable**
2. Adicione o nome exato da variável
3. Cole o valor correspondente
4. Clique **Save**

## 4. Após adicionar todas as variáveis:
1. Vá para **Deploys**
2. Clique **Trigger Deploy** → **Deploy Site**
3. Aguarde o deploy terminar (3-5 minutos)

## 5. Como testar se funcionou:
1. Acesse seu site Netlify
2. Vá para `/orcamentos`
3. Abra F12 → Console
4. Deve aparecer:
   - `🧪 TESTE AUTOMÁTICO - Diagnóstico EmailJS`
   - `📋 Variáveis carregadas:` (com valores, não "FALTANDO")
   - `✅ EmailJS importado: function`
   - `🎉 TESTE AUTOMÁTICO PASSOU!`

## ⚠️ Se ainda mostrar "FALTANDO":
- As variáveis não foram configuradas corretamente
- Precisa fazer novo deploy após adicionar variáveis
- Aguardar 5-10 minutos para propagação completa