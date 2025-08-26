# Templates de Email para EmailJS

Este arquivo contém os templates profissionais que devem ser configurados no EmailJS para o sistema de orçamentos da EditData.

## 1. Template de Notificação para Empresa (template_quote_request)

**Assunto:** Nova Solicitação de Orçamento - {{client_name}}

**Corpo do Email:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Solicitação de Orçamento</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 20px;
            border: 1px solid #e2e8f0;
        }
        .footer {
            background-color: #64748b;
            color: white;
            padding: 15px 20px;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 10px;
            margin: 15px 0;
        }
        .label {
            font-weight: bold;
            color: #475569;
        }
        .value {
            background-color: white;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        .services {
            background-color: #dbeafe;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .urgent {
            color: #dc2626;
            font-weight: bold;
        }
        .medium {
            color: #f59e0b;
            font-weight: bold;
        }
        .low {
            color: #16a34a;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Nova Solicitação de Orçamento</h1>
        <p>Recebida em {{created_at}}</p>
    </div>
    
    <div class="content">
        <h2>Informações do Cliente</h2>
        <div class="info-grid">
            <div class="label">Nome:</div>
            <div class="value">{{client_name}}</div>
            
            <div class="label">Email:</div>
            <div class="value">{{client_email}}</div>
            
            <div class="label">Telefone:</div>
            <div class="value">{{client_phone}}</div>
            
            <div class="label">Empresa:</div>
            <div class="value">{{company_name}}</div>
        </div>

        <h2>Detalhes do Projeto</h2>
        <div class="info-grid">
            <div class="label">Tipo de Projeto:</div>
            <div class="value">{{project_type}}</div>
            
            <div class="label">Urgência:</div>
            <div class="value urgency-{{urgency}}">{{urgency}}</div>
            
            <div class="label">Orçamento:</div>
            <div class="value">{{budget}}</div>
            
            <div class="label">Prazo:</div>
            <div class="value">{{deadline}}</div>
        </div>

        <h2>Serviços Solicitados</h2>
        <div class="services">
            <strong>{{services}}</strong>
        </div>

        <h2>Descrição do Projeto</h2>
        <div class="value">
            {{description}}
        </div>

        {{#if additional_info}}
        <h2>Informações Adicionais</h2>
        <div class="value">
            {{additional_info}}
        </div>
        {{/if}}
    </div>
    
    <div class="footer">
        <p><strong>EditData Soluções Inteligentes</strong></p>
        <p>📧 Email: edinaldobl@editdata.com.br</p>
        <p>🌐 Este orçamento foi gerado automaticamente pelo sistema online.</p>
    </div>
</body>
</html>
```

## 2. Template de Confirmação para Cliente (template_confirmation)

**Assunto:** Confirmação de Recebimento - Solicitação de Orçamento #{{request_id}}

**Corpo do Email:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Recebimento</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #10b981;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f0fdf4;
            padding: 20px;
            border: 1px solid #bbf7d0;
        }
        .footer {
            background-color: #059669;
            color: white;
            padding: 15px 20px;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
        }
        .highlight {
            background-color: #dcfce7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #22c55e;
            margin: 15px 0;
        }
        .steps {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .step {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        .step-number {
            background-color: #2563eb;
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Orçamento Recebido com Sucesso!</h1>
        <p>Olá, {{client_name}}!</p>
    </div>
    
    <div class="content">
        <div class="highlight">
            <h2>🎉 Recebemos sua solicitação!</h2>
            <p>Sua solicitação de orçamento para <strong>"{{project_type}}"</strong> foi recebida em {{created_at}} e já está sendo analisada por nossa equipe especializada.</p>
        </div>

        <div class="steps">
            <h3>📋 Próximos Passos:</h3>
            
            <div class="step">
                <div class="step-number">1</div>
                <div>
                    <strong>Análise Técnica</strong><br>
                    Nossa equipe analisará os detalhes do seu projeto nas próximas 2-4 horas.
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div>
                    <strong>Orçamento Personalizado</strong><br>
                    Prepararemos um orçamento detalhado e personalizado para suas necessidades.
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div>
                    <strong>Contato Direto</strong><br>
                    Entraremos em contato em até <strong>24 horas</strong> via email ou telefone.
                </div>
            </div>
        </div>

        <div class="highlight">
            <h3>📞 Precisa de Contato Imediato?</h3>
            <p>Se seu projeto é urgente ou você tem dúvidas, entre em contato conosco:</p>
            <ul>
                <li><strong>Email:</strong> edinaldobl@editdata.com.br</li>
                <li><strong>Referência:</strong> Orçamento #{{request_id}}</li>
            </ul>
        </div>

        <p><strong>Obrigado por escolher a EditData!</strong></p>
        <p>Estamos ansiosos para ajudá-lo a otimizar seus processos e aumentar sua produtividade.</p>
    </div>
    
    <div class="footer">
        <p><strong>EditData Soluções Inteligentes</strong></p>
        <p>Especialistas em Automação de Planilhas e Otimização de Processos</p>
        <p>📧 edinaldobl@editdata.com.br</p>
        <p>Este é um email automático. Por favor, não responda a este endereço.</p>
    </div>
</body>
</html>
```

## 3. Configuração no EmailJS

### Passo a Passo para Configurar os Templates:

1. **Acesse o EmailJS Dashboard**
   - Faça login em https://www.emailjs.com/
   - Vá para "Email Templates"

2. **Criar Template de Notificação (template_quote_request)**
   - Clique em "Create New Template"
   - Template ID: `template_quote_request`
   - Assunto: `Nova Solicitação de Orçamento - {{client_name}}`
   - Cole o HTML do template de notificação
   - Configure as variáveis conforme listadas

3. **Criar Template de Confirmação (template_confirmation)**
   - Clique em "Create New Template"
   - Template ID: `template_confirmation`
   - Assunto: `Confirmação de Recebimento - Solicitação de Orçamento #{{request_id}}`
   - Cole o HTML do template de confirmação
   - Configure as variáveis conforme listadas

4. **Configurar Variáveis**
   - Certifique-se de que todas as variáveis estão mapeadas corretamente
   - Teste os templates usando a função "Test" do EmailJS

### Variáveis Utilizadas:

**Template de Notificação:**
- `{{client_name}}` - Nome do cliente
- `{{client_email}}` - Email do cliente
- `{{client_phone}}` - Telefone do cliente
- `{{company_name}}` - Nome da empresa
- `{{project_type}}` - Tipo de projeto
- `{{services}}` - Serviços selecionados
- `{{description}}` - Descrição do projeto
- `{{urgency}}` - Urgência (Baixa/Média/Alta)
- `{{budget}}` - Faixa de orçamento
- `{{deadline}}` - Prazo desejado
- `{{additional_info}}` - Informações adicionais
- `{{created_at}}` - Data e hora de criação

**Template de Confirmação:**
- `{{client_name}}` - Nome do cliente
- `{{client_email}}` - Email do cliente
- `{{project_type}}` - Tipo de projeto
- `{{request_id}}` - ID da solicitação
- `{{created_at}}` - Data e hora de criação

## 4. Personalização Adicional

Você pode personalizar os templates adicionando:
- Logo da empresa no cabeçalho
- Cores personalizadas
- Links para redes sociais
- Informações de contato adicionais
- Termos e condições

## 5. Testes Recomendados

Após configurar os templates:
1. Teste com dados reais usando o painel do EmailJS
2. Verifique a renderização em diferentes clientes de email
3. Teste a responsividade em dispositivos móveis
4. Confirme que todas as variáveis são substituídas corretamente