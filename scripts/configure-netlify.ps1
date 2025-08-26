# 🚀 Auto Configuração Netlify - EditData
# Execute este script após instalar o Netlify CLI

Write-Host "================================" -ForegroundColor Blue
Write-Host "🚀 Auto Deploy Netlify - EditData" -ForegroundColor Blue  
Write-Host "================================" -ForegroundColor Blue
Write-Host ""

# Verificar se .env.local existe
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Arquivo .env.local não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na pasta do projeto." -ForegroundColor Yellow
    exit 1
}

Write-Host "🔐 Fazendo login no Netlify..." -ForegroundColor Green
netlify login

Write-Host ""
Write-Host "📋 Configurando variáveis de ambiente automaticamente..." -ForegroundColor Green
Write-Host ""

# Ler e configurar variáveis do .env.local
$envVars = Get-Content ".env.local" | Where-Object { $_ -match "^NEXT_PUBLIC_" -and $_ -contains "=" }

foreach ($line in $envVars) {
    $parts = $line -split "=", 2
    $varName = $parts[0].Trim()
    $varValue = $parts[1].Trim()
    
    Write-Host "⚙️  Configurando $varName..." -ForegroundColor Cyan
    & netlify env:set $varName $varValue
}

Write-Host ""
Write-Host "📊 Verificando variáveis configuradas..." -ForegroundColor Green
netlify env:list

Write-Host ""
Write-Host "🔄 Disparando novo deploy..." -ForegroundColor Green
netlify deploy --prod

Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host "🌐 Aguarde 2-3 minutos para deploy finalizar" -ForegroundColor Yellow
Write-Host "📧 Sistema de email estará ativo!" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Para testar:" -ForegroundColor Blue
Write-Host "1. Acesse seu site Netlify" -ForegroundColor White
Write-Host "2. Vá para /orcamentos" -ForegroundColor White  
Write-Host "3. Envie um teste" -ForegroundColor White
Write-Host "4. Verifique email em edinaldobl@editdata.com.br" -ForegroundColor White

Read-Host "Pressione Enter para continuar..."