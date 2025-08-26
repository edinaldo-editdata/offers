import { QuoteRequest } from '@/types';

// Configuração do Netlify Forms
const NETLIFY_FORM_NAME = process.env.NEXT_PUBLIC_NETLIFY_FORM_NAME || 'quote-requests';

/**
 * Envia dados para Netlify Forms
 */
export const submitToNetlifyForms = async (quoteRequest: QuoteRequest, serviceNames: string[]): Promise<boolean> => {
  try {
    // Preparar dados para o Netlify Forms
    const formData = new FormData();
    
    // Campo obrigatório do Netlify Forms
    formData.append('form-name', NETLIFY_FORM_NAME);
    
    // Dados do cliente
    formData.append('client-name', quoteRequest.clientName);
    formData.append('client-email', quoteRequest.clientEmail);
    formData.append('client-phone', quoteRequest.clientPhone);
    formData.append('company-name', quoteRequest.companyName || '');
    
    // Dados do projeto
    formData.append('project-type', quoteRequest.projectType);
    formData.append('services', serviceNames.join(', '));
    formData.append('description', quoteRequest.description);
    formData.append('urgency', quoteRequest.urgency);
    formData.append('budget', quoteRequest.budget);
    formData.append('deadline', quoteRequest.deadline || '');
    formData.append('additional-info', quoteRequest.additionalInfo || '');
    
    // Metadados
    formData.append('request-id', quoteRequest.id);
    formData.append('created-at', quoteRequest.createdAt);
    
    // Enviar para o Netlify
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString()
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar para Netlify Forms:', error);
    return false;
  }
};

/**
 * Verifica se Netlify Forms está disponível
 */
export const isNetlifyFormsAvailable = (): boolean => {
  // Netlify Forms só funciona em produção no Netlify
  return typeof window !== 'undefined' && 
         (window.location.hostname.includes('netlify.app') || 
          window.location.hostname.includes('netlify.com') ||
          process.env.NODE_ENV === 'production');
};