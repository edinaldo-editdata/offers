import { QuoteRequest } from '@/types';

// Configurações do EmailJS - usando templates personalizados
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_vb6uptu',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_5xviysf',
  confirmationTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID || 'template_r3bds0a',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'yj42PJzyGOZpxcWk1',
  companyEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contato@editdata.com.br'
};

// Interface para dados do template de email
export interface EmailTemplateParams extends Record<string, unknown> {
  // Dados do cliente
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string;
  
  // Dados do projeto
  project_type: string;
  services: string;
  description: string;
  urgency: string;
  budget: string;
  deadline: string;
  additional_info: string;
  created_at: string;
  
  // Email de destino (onde o email será enviado)
  to_email: string;
  to_name: string;
  
  // Dados da empresa (remetente)
  from_name: string;
  from_email: string;
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
    // Dados do cliente
    client_name: quoteRequest.clientName,
    client_email: quoteRequest.clientEmail,
    client_phone: quoteRequest.clientPhone,
    company_name: quoteRequest.companyName || 'Não informado',
    
    // Dados do projeto
    project_type: quoteRequest.projectType,
    services: serviceNames.join(', '),
    description: quoteRequest.description,
    urgency: getUrgencyText(quoteRequest.urgency),
    budget: getBudgetText(quoteRequest.budget),
    deadline: quoteRequest.deadline || 'Não especificado',
    additional_info: quoteRequest.additionalInfo || 'Nenhuma informação adicional',
    created_at: new Date(quoteRequest.createdAt).toLocaleString('pt-BR'),
    
    // Email de destino (PARA ONDE o email vai)
    to_email: EMAILJS_CONFIG.companyEmail, // contato@editdata.com.br
    to_name: 'EditData - Equipe de Vendas',
    
    // Dados da empresa (remetente)
    from_name: quoteRequest.clientName,
    from_email: quoteRequest.clientEmail
  };
};

/**
 * Envia email de notificação usando template personalizado
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

    // Converter dados para parâmetros do template personalizado
    const templateParams = convertQuoteToEmailParams(quoteRequest, serviceNames);

    console.log('📧 Enviando com template personalizado:', EMAILJS_CONFIG.templateId);
    console.log('🏢 Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('📝 Dados do template:', JSON.stringify(templateParams, null, 2));
    console.log('🔑 Public Key (parcial):', EMAILJS_CONFIG.publicKey ? EMAILJS_CONFIG.publicKey.substring(0, 8) + '...' : 'FALTANDO');

    // Enviar email usando template personalizado
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
 * Envia confirmação usando template personalizado para o cliente
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

    // Template específico para confirmação do cliente
    const confirmationParams = {
      // Dados do cliente (quem VAI RECEBER o email)
      to_email: quoteRequest.clientEmail, // Email do cliente
      to_name: quoteRequest.clientName,
      client_name: quoteRequest.clientName,
      client_email: quoteRequest.clientEmail,
      
      // Dados do projeto
      project_type: quoteRequest.projectType,
      request_id: quoteRequest.id,
      created_at: new Date(quoteRequest.createdAt).toLocaleString('pt-BR'),
      
      // Dados da empresa (remetente)
      from_name: 'EditData Soluções Inteligentes',
      from_email: EMAILJS_CONFIG.companyEmail, // contato@editdata.com.br
      company_email: EMAILJS_CONFIG.companyEmail
    };

    console.log('📧 Enviando confirmação com template:', EMAILJS_CONFIG.confirmationTemplateId);
    console.log('🏢 Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('📝 Dados da confirmação:', JSON.stringify(confirmationParams, null, 2));

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.confirmationTemplateId,
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
  const isConfigured = !!(
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.confirmationTemplateId &&
    EMAILJS_CONFIG.publicKey
  );
  
  console.log('🔧 Verificação de configuração EmailJS:', {
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.templateId,
    confirmationTemplateId: EMAILJS_CONFIG.confirmationTemplateId,
    publicKey: EMAILJS_CONFIG.publicKey ? 'Configurada' : 'Faltando',
    companyEmail: EMAILJS_CONFIG.companyEmail
  });
  
  return isConfigured;
};