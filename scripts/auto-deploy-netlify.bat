@echo off
echo ================================
echo 🚀 Auto Deploy Netlify - EditData
echo ================================
echo.

REM Verificar se Netlify CLI está instalado
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando Netlify CLI...
    npm install -g netlify-cli
    echo ✅ Netlify CLI instalado!
    echo.
)

echo 🔐 Fazendo login no Netlify...
netlify login

echo.
echo 📋 Configurando variáveis de ambiente...
echo.

REM Ler variáveis do arquivo .env.local
for /f "tokens=1,2 delims==" %%a in (.env.local) do (
    if "%%a"=="NEXT_PUBLIC_EMAILJS_SERVICE_ID" (
        echo ⚙️  Configurando SERVICE_ID...
        netlify env:set NEXT_PUBLIC_EMAILJS_SERVICE_ID "%%b"
    )
    if "%%a"=="NEXT_PUBLIC_EMAILJS_TEMPLATE_ID" (
        echo ⚙️  Configurando TEMPLATE_ID...
        netlify env:set NEXT_PUBLIC_EMAILJS_TEMPLATE_ID "%%b"
    )
    if "%%a"=="NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID" (
        echo ⚙️  Configurando CONFIRMATION_TEMPLATE_ID...
        netlify env:set NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID "%%b"
    )
    if "%%a"=="NEXT_PUBLIC_EMAILJS_PUBLIC_KEY" (
        echo ⚙️  Configurando PUBLIC_KEY...
        netlify env:set NEXT_PUBLIC_EMAILJS_PUBLIC_KEY "%%b"
    )
    if "%%a"=="NEXT_PUBLIC_COMPANY_EMAIL" (
        echo ⚙️  Configurando COMPANY_EMAIL...
        netlify env:set NEXT_PUBLIC_COMPANY_EMAIL "%%b"
    )
    if "%%a"=="NEXT_PUBLIC_NETLIFY_FORM_NAME" (
        echo ⚙️  Configurando FORM_NAME...
        netlify env:set NEXT_PUBLIC_NETLIFY_FORM_NAME "%%b"
    )
)

echo.
echo 📊 Listando variáveis configuradas...
netlify env:list

echo.
echo 🔄 Forçando novo deploy...
netlify deploy --prod --build

echo.
echo ✅ Deploy concluído!
echo 🌐 Acesse seu site no Netlify Dashboard
echo 📧 Sistema de email ativo!
echo.
pause