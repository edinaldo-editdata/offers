# 🔧 Guia: Corrigir Templates do EmailJS

## ❌ Problemas Identificados:
1. **Email enviado para endereço errado**: `teste@editdata.com.br` em vez do email correto
2. **Variáveis corrompidas**: "One or more dynamic variables are corrupted"
3. **Erro 422**: "The recipients address is empty"

## 📍 Localização dos Templates
Acesse: https://dashboard.emailjs.com/admin
Login: edinaldobl@editdata.com.br

## 🛠️ Correções Necessárias

### Template 1: `template_5xviysf` (Notificação para Empresa)

**No campo "To":**
```
{{to_email}}
```
**⚠️ NÃO use email fixo como `teste@editdata.com.br`**

**No campo "Subject":**
```
Nova Solicitação de Orçamento - {{client_name}}
```

**No corpo do email, use estas variáveis:**
```
Cliente: {{client_name}}
Email: {{client_email}}
Telefone: {{client_phone}}
Empresa: {{company_name}}
Tipo de Projeto: {{project_type}}
Serviços: {{services}}
Descrição: {{description}}
Urgência: {{urgency}}
Orçamento: {{budget}}
Prazo: {{deadline}}
Informações Adicionais: {{additional_info}}
Data: {{created_at}}
```

### Template 2: `template_r3bds0a` (Confirmação para Cliente)

**No campo "To":**
```
{{to_email}}
```

**No campo "Subject":**
```
Confirmação - Sua solicitação foi recebida
```

**No corpo do email:**
```
Olá {{client_name}},

Recebemos sua solicitação de orçamento para: {{project_type}}

ID da Solicitação: {{request_id}}
Data: {{created_at}}

Nossa equipe entrará em contato em breve.

Atenciosamente,
{{from_name}}
{{company_email}}
```

## ✅ Como Testar:
1. Salve as alterações nos templates
2. Abra o arquivo: `c:\Users\edina\gscripts\EditData\Offers\scripts\teste-templates.html`
3. Clique nos botões de teste
4. Verifique se os emails chegam nos endereços corretos

## 🎯 Resultado Esperado:
- **Notificação**: Deve chegar em `contato@editdata.com.br`
- **Confirmação**: Deve chegar no email que o cliente digitou no formulário
- **Sem erros 422**: Templates devem aceitar todas as variáveis

## 🆘 Se Continuar com Erro:
1. Verifique se NÃO há caracteres especiais nas variáveis
2. Certifique-se que `{{to_email}}` está exatamente assim (com chaves duplas)
3. Remova qualquer email fixo dos templates
4. Teste com o arquivo HTML de teste

## 📞 Próximo Passo:
Após corrigir os templates, me avise e podemos testar o sistema completo!