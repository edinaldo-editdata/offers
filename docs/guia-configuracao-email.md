# Guia de Configuração - Integração de Email

Este guia explica como configurar completamente o sistema de email para o projeto Offers da EditData.

## 📋 Visão Geral

O projeto agora suporta dois métodos de notificação por email:

1. **EmailJS** - Para envio direto de emails do frontend
2. **Netlify Forms** - Para captura e notificação via Netlify

## 🚀 Configuração do EmailJS

### Passo 1: Criar Conta no EmailJS

1. Acesse https://www.emailjs.com/
2. Crie uma conta gratuita
3. Confirme seu email

### Passo 2: Configurar Serviço de Email

1. No dashboard, vá para "Email Services"
2. Clique "Add New Service"
3. Escolha seu provedor (recomendado: Gmail)
4. Configure com suas credenciais
5. Anote o **Service ID** gerado

### Passo 3: Criar Templates

Siga o arquivo [`docs/email-templates.md`](./email-templates.md) para criar:
- Template de notificação para empresa (`template_quote_request`)
- Template de confirmação para cliente (`template_confirmation`)

### Passo 4: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Preencha as variáveis do EmailJS:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id_aqui
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_quote_request
NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID=template_confirmation
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=sua_public_key_aqui
```

### Passo 5: Obter Chave Pública

1. No EmailJS, vá para "Account" > "General"
2. Encontre sua "Public Key"
3. Copie para `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

## 🌐 Configuração do Netlify Forms

### Passo 1: Deploy no Netlify

1. Conecte seu repositório ao Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Passo 2: Configurar Notificações

1. No dashboard do Netlify, vá para seu site
2. Acesse "Forms" na barra lateral
3. Configure notificações por email:
   - Vá para "Settings & Usage"
   - Configure "Form notifications"
   - Adicione seu email para receber notificações

### Passo 3: Testar Formulário

O formulário será automaticamente detectado pelo Netlify após o primeiro deploy que inclui o arquivo `public/netlify-form.html`.

## 🔧 Configurações Avançadas

### Personalizar Templates

Para personalizar os templates de email:

1. Edite os templates no EmailJS dashboard
2. Adicione seu logo empresa
3. Personalize cores e estilos
4. Teste com dados reais

### Configurar Webhook (Opcional)

Para integração mais avançada com Netlify Forms:

1. Configure um webhook no Netlify
2. Implemente endpoint para processar submissions
3. Adicione lógica de negócio personalizada

### Monitoramento e Analytics

Para monitorar o sistema de email:

1. Configure alertas no EmailJS
2. Use Netlify Analytics para forms
3. Implemente logging personalizado

## 🧪 Testes

### Teste Local

1. Configure variáveis de ambiente local
2. Execute: `npm run dev`
3. Acesse: `http://localhost:3000/orcamentos`
4. Preencha e envie um teste

### Teste em Produção

1. Deploy no Netlify
2. Teste formulário na URL de produção
3. Verifique recebimento de emails
4. Confirme funcionalidade do Netlify Forms

## 🚨 Solução de Problemas

### EmailJS não funciona

**Problema:** Emails não são enviados
**Soluções:**
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o serviço EmailJS está ativo
- Verifique console do navegador para erros
- Teste templates no dashboard do EmailJS

### Netlify Forms não detecta formulário

**Problema:** Formulário não aparece no dashboard
**Soluções:**
- Certifique-se que `public/netlify-form.html` foi incluído no build
- Verifique se o atributo `netlify` está presente
- Faça um novo deploy
- Aguarde alguns minutos para detecção

### Variáveis de ambiente não carregam

**Problema:** Configurações não são aplicadas
**Soluções:**
- Certifique-se que arquivos `.env*` não estão no `.gitignore`
- Use prefixo `NEXT_PUBLIC_` para variáveis do frontend
- Reinicie o servidor de desenvolvimento
- Verifique sintaxe do arquivo `.env`

## 📈 Melhorias Futuras

### Próximas Funcionalidades

1. **Resposta Automática**
   - Email automático com prazo estimado
   - Links para acompanhar status

2. **Template Engine Avançado**
   - Templates baseados no tipo de serviço
   - Personalização por urgência

3. **Integração CRM**
   - Sincronização automática com CRM
   - Histórico de interações

4. **Analytics Detalhado**
   - Taxa de abertura de emails
   - Tempo de resposta médio
   - Conversão de leads

### Otimizações de Performance

1. **Lazy Loading**
   - Carregamento sob demanda do EmailJS
   - Redução do bundle inicial

2. **Retry Logic**
   - Retry automático em caso de falha
   - Fallback entre métodos

3. **Caching**
   - Cache de configurações
   - Otimização de requests

## 🔐 Segurança

### Boas Práticas

1. **Proteção de Dados**
   - Não expor chaves privadas
   - Validação de dados no frontend
   - Sanitização de inputs

2. **Rate Limiting**
   - Implementar limite de envios
   - Proteção contra spam
   - Captcha se necessário

3. **Monitoramento**
   - Log de tentativas de envio
   - Alertas de falhas
   - Backup de dados importantes

## 📞 Suporte

Para dúvidas sobre a configuração:

1. Consulte a documentação oficial:
   - [EmailJS Documentation](https://www.emailjs.com/docs/)
   - [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)

2. Verifique os logs do sistema
3. Entre em contato com a equipe de desenvolvimento

## ✅ Checklist de Configuração

- [ ] Conta EmailJS criada e configurada
- [ ] Serviço de email configurado no EmailJS
- [ ] Templates de email criados
- [ ] Variáveis de ambiente configuradas
- [ ] Teste local realizado com sucesso
- [ ] Deploy no Netlify realizado
- [ ] Netlify Forms configurado
- [ ] Notificações do Netlify configuradas
- [ ] Teste em produção realizado
- [ ] Monitoramento configurado
- [ ] Documentação da equipe atualizada

Seguindo este guia, você terá um sistema de notificação por email robusto e confiável para o projeto Offers.