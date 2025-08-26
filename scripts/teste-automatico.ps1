# 🧪 Teste Automático - Sistema EmailJS + Netlify
# Execute este script para validar se tudo está funcionando

Write-Host "================================" -ForegroundColor Blue
Write-Host "🧪 Teste Automático - EditData" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host ""

# Verificar se está na pasta correta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script na pasta do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Verificando configuração local..." -ForegroundColor Green

# Verificar .env.local
if (Test-Path ".env.local") {
    Write-Host "✅ Arquivo .env.local encontrado" -ForegroundColor Green
    
    # Verificar se variáveis estão preenchidas
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "user_\w+") {
        Write-Host "✅ Public Key do EmailJS configurada" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Public Key não encontrada ou inválida" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Arquivo .env.local não encontrado!" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Verificando se site está acessível..." -ForegroundColor Green

# Verificar se git está atualizado
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Há mudanças não commitadas" -ForegroundColor Yellow
} else {
    Write-Host "✅ Git está atualizado" -ForegroundColor Green
}

# Verificar último commit
$lastCommit = git log --oneline -1
Write-Host "📝 Último commit: $lastCommit" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔧 Testando build local..." -ForegroundColor Green

# Testar build
try {
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build local bem-sucedido" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro no build local!" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erro ao executar build" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 RESULTADOS DO TESTE:" -ForegroundColor Blue
Write-Host "======================" -ForegroundColor Blue

Write-Host ""
Write-Host "🌐 PRÓXIMOS PASSOS:" -ForegroundColor Green
Write-Host "1. Acesse: https://app.netlify.com/" -ForegroundColor White
Write-Host "2. Verifique se deploy está 'Published'" -ForegroundColor White
Write-Host "3. Teste o formulário no seu site" -ForegroundColor White
Write-Host "4. Verifique emails em edinaldobl@editdata.com.br" -ForegroundColor White

Write-Host ""
Write-Host "🧪 TESTE MANUAL:" -ForegroundColor Yellow
Write-Host "- Acesse: [seu-site].netlify.app/orcamentos" -ForegroundColor White
Write-Host "- Preencha e envie um teste" -ForegroundColor White
Write-Host "- Verifique se chegaram emails" -ForegroundColor White

Write-Host ""
Write-Host "✅ Script concluído!" -ForegroundColor Green

Read-Host "Pressione Enter para continuar..."