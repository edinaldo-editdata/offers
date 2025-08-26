import { QuoteRequest } from '@/types';

// Configurações do EmailJS - versão simplificada que sempre funciona
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'default_service',
  templateId: 'contact_form', // Template padrão que sempre existe
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  companyEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contato@editdata.com.br'
};

// Interface para dados do template de email
export interface EmailTemplateParams extends Record<string, unknown> {
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string;
  project_type: string;
  services: string;
  description: string;
  urgency: string;
  budget: string;
  deadline: string;
  additional_info: string;
  created_at: string;
}

/**
 * Converte urgência para texto em português
 */
export const getUrgencyText = (urgency: QuoteRequest['urgency']): string => {
  const urgencyMap = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };
  return urgencyMap[urgency];
};

/**
 * Converte orçamento para texto em português
 */
export const getBudgetText = (budget: QuoteRequest['budget']): string => {
  const budgetMap = {
    'under-5k': 'Até R$ 5.000',
    '5k-15k': 'R$ 5.000 - R$ 15.000',
    '15k-30k': 'R$ 15.000 - R$ 30.000',
    'above-30k': 'Acima de R$ 30.000'
  };
  return budgetMap[budget];
};

/**
 * Converte dados do orçamento para parâmetros do template de email
 */
export const convertQuoteToEmailParams = (
  quoteRequest: QuoteRequest,
  serviceNames: string[]
): EmailTemplateParams => {
  return {
    client_name: quoteRequest.clientName,
    client_email: quoteRequest.clientEmail,
    client_phone: quoteRequest.clientPhone,
    company_name: quoteRequest.companyName || 'Não informado',
    project_type: quoteRequest.projectType,
    services: serviceNames.join(', '),
    description: quoteRequest.description,
    urgency: getUrgencyText(quoteRequest.urgency),
    budget: getBudgetText(quoteRequest.budget),
    deadline: quoteRequest.deadline || 'Não especificado',
    additional_info: quoteRequest.additionalInfo || 'Nenhuma informação adicional',
    created_at: new Date(quoteRequest.createdAt).toLocaleString('pt-BR')
  };
};

/**
 * Envia email usando template padrão do EmailJS
 */
export const sendQuoteNotificationEmail = async (
  quoteRequest: QuoteRequest,
  serviceNames: string[]
): Promise<boolean> => {
  try {
    // Verificar se EmailJS está disponível
    if (typeof window === 'undefined') {
      console.warn('EmailJS: Tentativa de envio no servidor - ignorando');
      return false;
    }

    // Importação dinâmica do EmailJS para evitar problemas de SSR
    let emailjs;
    try {
      const emailjsModule = await import('@emailjs/browser');
      emailjs = emailjsModule.default;
      console.log('EmailJS carregado com sucesso');
    } catch (importError) {
      console.error('Erro ao importar EmailJS:', importError);
      return false;
    }

    // Verificar se EmailJS foi carregado corretamente
    if (!emailjs || typeof emailjs.init !== 'function') {
      console.error('EmailJS não carregou corretamente');
      return false;
    }

    // Verificar se as configurações estão definidas
    if (!EMAILJS_CONFIG.publicKey) {
      console.warn('EmailJS: Chave pública não configurada');
      return false;
    }

    // Inicializar EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Dados simplificados para template padrão
    const templateParams = {
      to_email: EMAILJS_CONFIG.companyEmail,
      from_name: quoteRequest.clientName,
      from_email: quoteRequest.clientEmail,
      message: `
NOVO ORÇAMENTO RECEBIDO

Cliente: ${quoteRequest.clientName}
Email: ${quoteRequest.clientEmail}
Telefone: ${quoteRequest.clientPhone}
Empresa: ${quoteRequest.companyName || 'Não informado'}
Projeto: ${quoteRequest.projectType}
Serviços: ${serviceNames.join(', ')}
Descrição: ${quoteRequest.description}
Urgência: ${getUrgencyText(quoteRequest.urgency)}
Orçamento: ${getBudgetText(quoteRequest.budget)}
Prazo: ${quoteRequest.deadline || 'Não especificado'}
Informações Adicionais: ${quoteRequest.additionalInfo || 'Nenhuma'}
Data: ${new Date(quoteRequest.createdAt).toLocaleString('pt-BR')}
      `,
      reply_to: quoteRequest.clientEmail
    };

    console.log('📧 Enviando com dados:', templateParams);

    // Enviar email usando template padrão
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('Email enviado com sucesso:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

/**
 * Envia confirmação simples para o cliente
 */
export const sendClientConfirmationEmail = async (
  quoteRequest: QuoteRequest
): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      console.warn('EmailJS: Tentativa de envio no servidor - ignorando');
      return false;
    }

    // Importação dinâmica do EmailJS para evitar problemas de SSR
    let emailjs;
    try {
      const emailjsModule = await import('@emailjs/browser');
      emailjs = emailjsModule.default;
      console.log('EmailJS carregado com sucesso (confirmação)');
    } catch (importError) {
      console.error('Erro ao importar EmailJS (confirmação):', importError);
      return false;
    }

    // Verificar se EmailJS foi carregado corretamente
    if (!emailjs || typeof emailjs.init !== 'function') {
      console.error('EmailJS não carregou corretamente (confirmação)');
      return false;
    }

    if (!EMAILJS_CONFIG.publicKey) {
      console.warn('EmailJS: Chave pública não configurada');
      return false;
    }

    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Dados para confirmação do cliente
    const confirmationParams = {
      to_email: quoteRequest.clientEmail,
      from_name: 'EditData Soluções Inteligentes',
      from_email: EMAILJS_CONFIG.companyEmail,
      message: `Olá ${quoteRequest.clientName},

Recebemos sua solicitação de orçamento!

Detalhes:
- Projeto: ${quoteRequest.projectType}
- ID da solicitação: ${quoteRequest.id}
- Data: ${new Date(quoteRequest.createdAt).toLocaleString('pt-BR')}

Nossa equipe entrará em contato em até 24 horas.

Obrigado!
EditData Soluções Inteligentes`,
      reply_to: EMAILJS_CONFIG.companyEmail
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      confirmationParams
    );

    console.log('Email de confirmação enviado:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return false;
  }
};

/**
 * Valida se o EmailJS está configurado corretamente
 */
export const isEmailConfigured = (): boolean => {
  const isConfigured = !!(EMAILJS_CONFIG.publicKey);
  console.log('🔧 Verificação de configuração EmailJS:', {
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.templateId,
    publicKey: EMAILJS_CONFIG.publicKey ? 'Configurada' : 'Faltando',
    companyEmail: EMAILJS_CONFIG.companyEmail
  });
  return isConfigured;
};
    EMAILJS_CONFIG.publicKey
  );
  
  console.log('🔧 Verificação de configuração EmailJS:', {
    serviceId: EMAILJS_CONFIG.serviceId || 'FALTANDO',
    templateId: EMAILJS_CONFIG.templateId || 'FALTANDO',
    publicKey: EMAILJS_CONFIG.publicKey ? `${EMAILJS_CONFIG.publicKey.substring(0, 8)}...` : 'FALTANDO',
    isConfigured
  });
  
  return isConfigured;
};