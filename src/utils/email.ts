import { QuoteRequest } from '@/types';

// Configurações do EmailJS - serão movidas para variáveis de ambiente
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_editdata',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_quote_request',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
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
 * Envia email de notificação usando EmailJS
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
    const { default: emailjs } = await import('@emailjs/browser');

    // Verificar se as configurações estão definidas
    if (!EMAILJS_CONFIG.publicKey) {
      console.warn('EmailJS: Chave pública não configurada');
      return false;
    }

    // Inicializar EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Converter dados para parâmetros do template
    const templateParams = convertQuoteToEmailParams(quoteRequest, serviceNames);

    // Enviar email
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
 * Envia email de confirmação para o cliente
 */
export const sendClientConfirmationEmail = async (
  quoteRequest: QuoteRequest
): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      console.warn('EmailJS: Tentativa de envio no servidor - ignorando');
      return false;
    }

    const { default: emailjs } = await import('@emailjs/browser');

    if (!EMAILJS_CONFIG.publicKey) {
      console.warn('EmailJS: Chave pública não configurada');
      return false;
    }

    emailjs.init(EMAILJS_CONFIG.publicKey);

    // Template específico para confirmação do cliente
    const confirmationParams = {
      client_name: quoteRequest.clientName,
      client_email: quoteRequest.clientEmail,
      project_type: quoteRequest.projectType,
      request_id: quoteRequest.id,
      created_at: new Date(quoteRequest.createdAt).toLocaleString('pt-BR')
    };

    // Usar template de confirmação (será configurado no EmailJS)
    const confirmationTemplateId = process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID || 'template_confirmation';

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      confirmationTemplateId,
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
  return !!(
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.publicKey
  );
};