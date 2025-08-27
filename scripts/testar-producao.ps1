# Script para testar autenticação em produção
Write-Host "🧪 Testando autenticação em produção..." -ForegroundColor Blue

$baseUrl = "https://editdata-offers.netlify.app"

# Função para fazer requisições web
function Test-WebEndpoint {
    param($url, $description)
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 15
        Write-Host "✅ $description - Status: $($response.StatusCode)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $description - Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "📋 Testando endpoints principais..." -ForegroundColor Yellow

# Testar página inicial
Test-WebEndpoint "$baseUrl/" "Página inicial"

# Testar página de login
Test-WebEndpoint "$baseUrl/auth/login" "Página de login"

# Testar API de sessão
Test-WebEndpoint "$baseUrl/api/auth/session" "API de sessão"

# Testar página de orçamentos
Test-WebEndpoint "$baseUrl/orcamentos" "Página de orçamentos"

Write-Host ""
Write-Host "🔐 Para testar login completo:" -ForegroundColor Cyan
Write-Host "1. Acesse: $baseUrl/auth/login" -ForegroundColor White
Write-Host "2. Email: admin@editdata.com.br" -ForegroundColor White
Write-Host "3. Senha: Admin123!" -ForegroundColor White
Write-Host "4. Deve redirecionar para: $baseUrl/admin" -ForegroundColor White

Write-Host ""
Write-Host "📊 Monitoramento do deploy:" -ForegroundColor Magenta
Write-Host "- Acesse: https://app.netlify.com/sites/editdata-offers/deploys" -ForegroundColor White
Write-Host "- Verifique se o ultimo deploy esta 'Published'" -ForegroundColor White
Write-Host "- Veja os logs se houver erros" -ForegroundColor White