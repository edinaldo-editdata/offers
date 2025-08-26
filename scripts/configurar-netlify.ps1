# Script para configurar variáveis de ambiente no Netlify
# Usage: .\configurar-netlify.ps1 -SiteId "seu_site_id" -AccessToken "seu_token"

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteId,
    [Parameter(Mandatory=$true)]
    [string]$AccessToken
)

# Validar parâmetros
if ([string]::IsNullOrWhiteSpace($SiteId) -or $SiteId -eq "SEU_SITE_ID_AQUI") {
    Write-Host "❌ Erro: Site ID é obrigatório" -ForegroundColor Red
    Write-Host "📋 Como obter:" -ForegroundColor Cyan
    Write-Host "1. Vá para https://app.netlify.com/"
    Write-Host "2. Clique no seu site"
    Write-Host "3. Site Settings → General → Site ID"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($AccessToken) -or $AccessToken -eq "SEU_TOKEN_AQUI") {
    Write-Host "❌ Erro: Access Token é obrigatório" -ForegroundColor Red
    Write-Host "🔑 Como obter:" -ForegroundColor Cyan
    Write-Host "1. Vá para https://app.netlify.com/user/applications"
    Write-Host "2. Clique 'New access token'"
    Write-Host "3. Copie o token gerado"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

$variables = @{
    "NEXT_PUBLIC_EMAILJS_SERVICE_ID" = "service_editdata_offers"
    "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID" = "template_5xviysf"
    "NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID" = "template_r3bds0a"
    "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY" = "yj42PJzyGOZpxcWk1"
    "NEXT_PUBLIC_COMPANY_EMAIL" = "contato@editdata.com.br"
    "NEXT_PUBLIC_NETLIFY_FORM_NAME" = "quote-requests"
}

Write-Host "🔧 Configurando variáveis no Netlify..." -ForegroundColor Yellow
Write-Host "📍 Site ID: $($SiteId.Substring(0, [Math]::Min(8, $SiteId.Length)))..." -ForegroundColor Cyan
Write-Host "🔑 Token: $($AccessToken.Substring(0, [Math]::Min(8, $AccessToken.Length)))..." -ForegroundColor Cyan
Write-Host ""

foreach ($var in $variables.GetEnumerator()) {
    $body = @{
        "key" = $var.Key
        "values" = @(
            @{
                "value" = $var.Value
                "context" = "all"
            }
        )
    } | ConvertTo-Json -Depth 3

    try {
        $response = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/accounts/sites/$SiteId/env" -Method POST -Headers $headers -Body $body
        Write-Host "✅ $($var.Key) configurada" -ForegroundColor Green
    } catch {
        $errorMessage = $_.Exception.Message
        if ($errorMessage -like "*401*" -or $errorMessage -like "*Unauthorized*") {
            Write-Host "❌ Token inválido ou expirado" -ForegroundColor Red
            Write-Host "🔑 Gere um novo token em: https://app.netlify.com/user/applications" -ForegroundColor Yellow
            exit 1
        } elseif ($errorMessage -like "*404*") {
            Write-Host "❌ Site ID não encontrado: $SiteId" -ForegroundColor Red
            Write-Host "📍 Verifique o Site ID em: Site Settings → General" -ForegroundColor Yellow
            exit 1
        } else {
            Write-Host "❌ Erro ao configurar $($var.Key): $errorMessage" -ForegroundColor Red
        }
    }
}

Write-Host "`n🚀 Disparando novo deploy..." -ForegroundColor Yellow
try {
    $deployResponse = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$SiteId/builds" -Method POST -Headers $headers
    Write-Host "✅ Deploy iniciado: $($deployResponse.id)" -ForegroundColor Green
    Write-Host "🌐 URL do deploy: https://app.netlify.com/sites/$SiteId/deploys/$($deployResponse.id)" -ForegroundColor Cyan
    Write-Host "⏳ Aguarde 3-5 minutos para o deploy terminar" -ForegroundColor Yellow
    Write-Host "`n🧪 Para testar após deploy:" -ForegroundColor Cyan
    Write-Host "1. Acesse seu site Netlify"
    Write-Host "2. Vá para /orcamentos"
    Write-Host "3. Abra F12 → Console"
    Write-Host "4. Deve aparecer: ✅ Todas as configurações estão corretas"
} catch {
    Write-Host "❌ Erro ao disparar deploy: $_" -ForegroundColor Red
    Write-Host "💡 Você pode disparar manualmente em: Deploys → Trigger Deploy" -ForegroundColor Yellow
}

