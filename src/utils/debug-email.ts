// Script de diagnóstico para EmailJS
import { QuoteRequest } from '@/types';

// Função de debug para testar EmailJS
export const debugEmailJS = async () => {
  console.log('🔍 Iniciando diagnóstico EmailJS...');
  
  // Verificar variáveis de ambiente
  const config = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    confirmationTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    companyEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL,
  };

  console.log('📋 Configurações carregadas:', {
    serviceId: config.serviceId || 'FALTANDO',
    templateId: config.templateId || 'FALTANDO',
    confirmationTemplateId: config.confirmationTemplateId || 'FALTANDO',
    publicKey: config.publicKey ? `${config.publicKey.substring(0, 8)}...` : 'FALTANDO',
    companyEmail: config.companyEmail || 'FALTANDO',
  });

  // Verificar se todas as variáveis estão definidas
  const missingVars = [];
  if (!config.serviceId) missingVars.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
  if (!config.templateId) missingVars.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
  if (!config.confirmationTemplateId) missingVars.push('NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID');
  if (!config.publicKey) missingVars.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');

  if (missingVars.length > 0) {
    console.error('❌ Variáveis faltando:', missingVars);
    return { success: false, error: `Variáveis faltando: ${missingVars.join(', ')}` };
  }

  try {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') {
      console.warn('⚠️ EmailJS só funciona no lado do cliente');
      return { success: false, error: 'EmailJS só funciona no lado do cliente' };
    }

    // Tentar carregar EmailJS
    console.log('📦 Tentando importar EmailJS...');
    let emailjs;
    try {
      const emailjsModule = await import('@emailjs/browser');
      emailjs = emailjsModule.default;
      console.log('✅ EmailJS importado com sucesso');
    } catch (importError) {
      console.error('❌ Erro ao importar EmailJS:', importError);
      return { 
        success: false, 
        error: 'Falha ao carregar EmailJS: ' + (importError instanceof Error ? importError.message : 'Erro desconhecido')
      };
    }

    // Verificar se EmailJS foi carregado corretamente
    if (!emailjs || typeof emailjs.init !== 'function') {
      console.error('❌ EmailJS não carregou corretamente');
      return { success: false, error: 'EmailJS não carregou corretamente' };
    }

    // Inicializar EmailJS
    console.log('🔧 Inicializando EmailJS com public key...');
    try {
      emailjs.init(config.publicKey!);
      console.log('✅ EmailJS inicializado');
    } catch (initError) {
      console.error('❌ Erro ao inicializar EmailJS:', initError);
      return { 
        success: false, 
        error: 'Erro ao inicializar EmailJS: ' + (initError instanceof Error ? initError.message : 'Erro desconhecido')
      };
    }

    // Dados de teste simplificados
    const testData = {
      to_email: config.companyEmail,
      from_name: 'Teste Diagnóstico',
      from_email: 'teste@editdata.com.br',
      message: 'Este é um teste automático do sistema de email. Se você recebeu este email, o sistema está funcionando corretamente!',
      reply_to: 'teste@editdata.com.br'
    };

    console.log('📧 Tentando enviar email de teste...');
    
    // Tentar enviar email usando template padrão
    const response = await emailjs.send(
      config.serviceId!,
      'contact_form', // Template padrão que sempre existe
      testData
    );

    console.log('✅ Email enviado com sucesso!', response);
    return { 
      success: true, 
      response,
      message: 'Email de teste enviado com sucesso!' 
    };

  } catch (error) {
    console.error('❌ Erro no EmailJS:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error
    };
  }
};

// Função para testar configuração
export const testEmailConfig = () => {
  const config = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    confirmationTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  };

  console.log('🔧 Testando configuração...');
  console.log('Service ID:', config.serviceId);
  console.log('Template ID:', config.templateId);
  console.log('Confirmation Template ID:', config.confirmationTemplateId);
  console.log('Public Key:', config.publicKey ? 'Configurada' : 'FALTANDO');

  return config;
};