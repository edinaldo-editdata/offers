# Script para configurar variáveis de ambiente no Netlify
# Substitua SITE_ID e NETLIFY_ACCESS_TOKEN pelos seus valores reais

param(
    [string]$SiteId = "SEU_SITE_ID_AQUI",
    [string]$AccessToken = "SEU_TOKEN_AQUI"
)

$headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

$variables = @{
    "NEXT_PUBLIC_EMAILJS_SERVICE_ID" = "service_editdata_offers"
    "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID" = "template_quote_notification" 
    "NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID" = "template_r3bds0a"
    "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY" = "yj42PJzyGOZpxcWk1"
    "NEXT_PUBLIC_COMPANY_EMAIL" = "contato@editdata.com.br"
    "NEXT_PUBLIC_NETLIFY_FORM_NAME" = "quote-requests"
}

Write-Host "🔧 Configurando variáveis no Netlify..." -ForegroundColor Yellow

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
        Write-Host "❌ Erro ao configurar $($var.Key): $_" -ForegroundColor Red
    }
}

Write-Host "`n🚀 Disparando novo deploy..." -ForegroundColor Yellow
try {
    $deployResponse = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$SiteId/builds" -Method POST -Headers $headers
    Write-Host "✅ Deploy iniciado: $($deployResponse.id)" -ForegroundColor Green
    Write-Host "⏳ Aguarde 3-5 minutos para o deploy terminar" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erro ao disparar deploy: $_" -ForegroundColor Red
}

Write-Host "`n📋 Para encontrar seu Site ID:" -ForegroundColor Cyan
Write-Host "1. Vá para https://app.netlify.com/"
Write-Host "2. Clique no seu site"
Write-Host "3. Em Site Settings, copie o Site ID"
Write-Host "`n🔑 Para criar Access Token:"
Write-Host "1. Vá para https://app.netlify.com/user/applications"
Write-Host "2. Clique 'New access token'"
Write-Host "3. Cole o token no script"