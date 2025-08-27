# Script para configurar variáveis de ambiente do NextAuth no Netlify
# Execute este script após fazer o deploy das mudanças

Write-Host "🔧 Configurando variáveis de ambiente do NextAuth no Netlify..." -ForegroundColor Blue

# Variáveis necessárias para NextAuth funcionar em produção
$envVars = @{
    'NEXTAUTH_URL' = 'https://editdata-offers.netlify.app'  # URL de produção
    'NEXTAUTH_SECRET' = 'super_secret_key_for_nextauth_production_environment_very_long_string_123456789'
}

Write-Host "📋 Variáveis que devem ser configuradas no Netlify:" -ForegroundColor Yellow
Write-Host ""

foreach ($key in $envVars.Keys) {
    Write-Host "• $key = $($envVars[$key])" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Passos para configurar:" -ForegroundColor Cyan
Write-Host "1. Acesse https://app.netlify.com/" -ForegroundColor White
Write-Host "2. Selecione o site 'editdata-offers'" -ForegroundColor White
Write-Host "3. Vá em Site Settings -> Environment Variables" -ForegroundColor White
Write-Host "4. Clique em 'Add variable' para cada variável acima" -ForegroundColor White
Write-Host "5. Após configurar, vá em Deploys -> Trigger deploy -> Deploy site" -ForegroundColor White

Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "- NEXTAUTH_URL deve ser a URL exata do site em producao" -ForegroundColor White
Write-Host "- NEXTAUTH_SECRET deve ser diferente do ambiente de desenvolvimento" -ForegroundColor White
Write-Host "- Apos configurar as variaveis, sempre faca um novo deploy" -ForegroundColor White

Write-Host ""
Write-Host "✅ Após configurar, teste:" -ForegroundColor Green
Write-Host "• Acesse https://editdata-offers.netlify.app/auth/login" -ForegroundColor White
Write-Host "• Login: admin@editdata.com.br" -ForegroundColor White
Write-Host "• Senha: Admin123!" -ForegroundColor White

Write-Host ""
Write-Host "🔍 Para verificar o status do deploy:" -ForegroundColor Blue
Write-Host "• Vá em Deploys no painel do Netlify" -ForegroundColor White
Write-Host "• Verifique se o deploy foi bem-sucedido" -ForegroundColor White
Write-Host "• Veja os logs se houver erros" -ForegroundColor White