# 🔑 Configuração Automática via Token Netlify

## Passo 1: Criar Token de Acesso
1. Acesse: https://app.netlify.com/user/applications
2. Clique em **"New access token"**
3. Digite um nome: "EditData Offers Config"
4. Clique **"Generate token"**
5. **COPIE O TOKEN** (só aparece uma vez!)

## Passo 2: Obter Site ID
1. Vá para: https://app.netlify.com/
2. Clique no seu site "EditData Offers"
3. Vá em **Site Settings** → **General**
4. Na seção "Site Information", **copie o Site ID**

## Passo 3: Executar Script Automático
```powershell
# No PowerShell, execute:
cd "C:\Users\edina\gscripts\EditData\Offers"
.\scripts\configurar-netlify.ps1 -SiteId "SEU_SITE_ID_AQUI" -AccessToken "SEU_TOKEN_AQUI"
```

## Exemplo:
```powershell
.\scripts\configurar-netlify.ps1 -SiteId "abc123def456" -AccessToken "nfp_xyz789abc123def456"
```

## O que o script faz automaticamente:
✅ Configura todas as 6 variáveis de ambiente
✅ Dispara novo deploy
✅ Mostra progresso e erros

## Alternativa Manual:
Se preferir fazer manualmente:
1. Site Settings → Environment Variables
2. Add Variable para cada uma:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID` = `service_editdata_offers`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` = `template_quote_notification`
   - `NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID` = `template_r3bds0a`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` = `yj42PJzyGOZpxcWk1`
   - `NEXT_PUBLIC_COMPANY_EMAIL` = `contato@editdata.com.br`
   - `NEXT_PUBLIC_NETLIFY_FORM_NAME` = `quote-requests`
3. Deploys → Trigger Deploy