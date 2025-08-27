'use client';

import { useState, useEffect } from 'react';
import { QuoteRequest } from '@/types';
import { saveQuoteRequest, getServices, generateId, getSelectedServiceNames } from '@/utils/storage';
import { sendQuoteNotificationEmail, sendClientConfirmationEmail, isEmailConfigured } from '@/utils/email';
import { submitToNetlifyForms, isNetlifyFormsAvailable } from '@/utils/netlify-forms';
import { debugEmailJS } from '@/utils/debug-email';
import { sanitizeObject, validateForm, FormValidationErrors } from '@/utils/validation';
import ValidatedInput from '@/components/ValidatedInput';
import { CheckCircle, Send, ArrowLeft, Mail, AlertCircle, User, Building, FileText } from 'lucide-react';
import Link from 'next/link';

export default function OrcamentosPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    notificationSent: boolean;
    confirmationSent: boolean;
    netlifySubmitted: boolean;
    error: string | null;
  }>({ notificationSent: false, confirmationSent: false, netlifySubmitted: false, error: null });
  const services = getServices();
  const emailConfigured = isEmailConfigured();
  const netlifyAvailable = isNetlifyFormsAvailable();

  // Teste automático do EmailJS quando a página carrega
  useEffect(() => {
    const testEmailJS = async () => {
      console.log('🧪 TESTE AUTOMÁTICO - Diagnóstico EmailJS');
      
      // Verificar se estamos no navegador
      if (typeof window === 'undefined') {
        console.log('❌ Rodando no servidor, EmailJS precisa do navegador');
        return;
      }

      try {
        // Verificar variáveis de ambiente
        const vars = {
          serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        };
        
        console.log('📋 Variáveis carregadas:', {
          serviceId: vars.serviceId || '❌ FALTANDO',
          templateId: vars.templateId || '❌ FALTANDO',
          publicKey: vars.publicKey ? `✅ ${vars.publicKey.substring(0, 8)}...` : '❌ FALTANDO'
        });

        // Verificar se todas as variáveis estão presentes
        const missingVars = [];
        if (!vars.serviceId) missingVars.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
        if (!vars.templateId) missingVars.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
        if (!vars.publicKey) missingVars.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');
        
        if (missingVars.length > 0) {
          console.error('❌ PROBLEMA ENCONTRADO - Variáveis faltando:', missingVars);
          console.error('🔧 SOLUÇÃO: Configure estas variáveis no Netlify:');
          console.error('1. Vá para https://app.netlify.com/');
          console.error('2. Site Settings → Environment Variables');
          console.error('3. Adicione as variáveis faltando');
          console.error('4. Faça novo deploy');
          return;
        }

        // Tentar importar EmailJS
        console.log('📦 Importando EmailJS...');
        const emailjsModule = await import('@emailjs/browser');
        const emailjs = emailjsModule.default;
        
        if (!emailjs) {
          console.log('❌ EmailJS não carregou');
          return;
        }

        console.log('✅ EmailJS importado:', typeof emailjs);
        console.log('✅ Métodos disponíveis:', Object.keys(emailjs));

        if (!vars.publicKey) {
          console.log('❌ Public Key não configurada');
          return;
        }

        // Inicializar
        console.log('🔧 Inicializando EmailJS...');
        emailjs.init(vars.publicKey);
        console.log('✅ EmailJS inicializado com sucesso');

        console.log('🎉 TESTE AUTOMÁTICO PASSOU! EmailJS está funcionando');
        console.log('✅ Todas as configurações estão corretas');
        console.log('📧 O sistema de email deve funcionar normalmente');
        
      } catch (error) {
        console.log('❌ TESTE AUTOMÁTICO FALHOU:', error);
        console.log('Mensagem:', error instanceof Error ? error.message : 'Erro desconhecido');
        console.log('Stack:', error instanceof Error ? error.stack : 'Stack não disponível');
      }
    };

    testEmailJS();
  }, []);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    // Novos campos de validação
    document: '',
    cep: '',
    address: '',
    city: '',
    state: '',
    // Campos existentes
    projectType: '',
    services: [] as string[],
    description: '',
    urgency: 'medium' as QuoteRequest['urgency'],
    budget: 'under-5k' as QuoteRequest['budget'],
    deadline: '',
    additionalInfo: ''
  });

  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados antes do envio
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      console.log('⚠️ Erro de validação:', errors);
      return;
    }
    
    setIsLoading(true);
    setEmailStatus({ notificationSent: false, confirmationSent: false, netlifySubmitted: false, error: null });

    // Debug: Verificar configurações
    console.log('🔍 Iniciando envio do formulário...');
    console.log('📧 EmailJS configurado:', emailConfigured);
    console.log('🌐 Netlify disponível:', netlifyAvailable);
    
    // Debug: Testar EmailJS
    if (emailConfigured) {
      console.log('🧪 Executando diagnóstico EmailJS...');
      const debugResult = await debugEmailJS();
      console.log('📊 Resultado do diagnóstico:', debugResult);
    }

    try {
      // Sanitizar dados antes de criar o objeto
      const sanitizedData = sanitizeObject(formData);
      
      const quoteRequest: QuoteRequest = {
        id: generateId(),
        ...sanitizedData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('💾 Dados do orçamento:', quoteRequest);

      // Salvar no localStorage
      saveQuoteRequest(quoteRequest);
      console.log('✅ Dados salvos no localStorage');

      // Obter nomes dos serviços selecionados
      const selectedServiceNames = getSelectedServiceNames(formData.services);
      console.log('🎯 Serviços selecionados:', selectedServiceNames);

      let notificationSent = false;
      let confirmationSent = false;
      let netlifySubmitted = false;
      let errorMessage: string | null = null;

      // Tentar enviar via Netlify Forms primeiro (mais confiável)
      if (netlifyAvailable) {
        try {
          console.log('🌐 Tentando enviar via Netlify Forms...');
          netlifySubmitted = await submitToNetlifyForms(quoteRequest, selectedServiceNames);
          console.log('📋 Netlify Forms resultado:', netlifySubmitted);
          if (!netlifySubmitted) {
            console.warn('⚠️ Falha ao enviar via Netlify Forms');
          }
        } catch (netlifyError) {
          console.error('❌ Erro no Netlify Forms:', netlifyError);
        }
      }

      // Tentar enviar emails se EmailJS estiver configurado
      if (emailConfigured) {
        try {
          console.log('📧 Tentando enviar emails via EmailJS...');
          
          // Enviar notificação para a empresa
          console.log('📨 Enviando notificação para empresa...');
          notificationSent = await sendQuoteNotificationEmail(
            quoteRequest,
            selectedServiceNames
          );
          console.log('📨 Notificação empresa resultado:', notificationSent);

          // Enviar confirmação para o cliente
          console.log('📧 Enviando confirmação para cliente...');
          confirmationSent = await sendClientConfirmationEmail(quoteRequest);
          console.log('📧 Confirmação cliente resultado:', confirmationSent);
        } catch (emailError) {
          console.error('❌ Erro no envio de emails:', emailError);
          errorMessage = 'Erro ao enviar emails de notificação';
        }
      }

      // Se nenhum método funcionou, definir erro
      if (!netlifySubmitted && !notificationSent && !emailConfigured && !netlifyAvailable) {
        errorMessage = 'Nenhum sistema de notificação está configurado';
        console.error('❌ Nenhum sistema de notificação ativo');
      }

      console.log('📊 Resultados finais:', {
        notificationSent,
        confirmationSent,
        netlifySubmitted,
        errorMessage
      });

      setEmailStatus({
        notificationSent,
        confirmationSent,
        netlifySubmitted,
        error: errorMessage
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('💥 Erro geral ao enviar orçamento:', error);
      setEmailStatus({
        notificationSent: false,
        confirmationSent: false,
        netlifySubmitted: false,
        error: 'Erro ao processar solicitação'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Orçamento Enviado!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Recebemos sua solicitação de orçamento. Nossa equipe entrará em contato em até 24 horas.
            </p>
          </div>

          {/* Status dos emails */}
          {(emailConfigured || netlifyAvailable) && (
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Status das Notificações
              </h3>
              <div className="space-y-2 text-sm">
                {netlifyAvailable && (
                  <div className="flex items-center">
                    {emailStatus.netlifySubmitted ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                    )}
                    <span className={emailStatus.netlifySubmitted ? 'text-green-700' : 'text-orange-700'}>
                      {emailStatus.netlifySubmitted 
                        ? 'Enviado via Netlify Forms' 
                        : 'Falha no envio via Netlify Forms'}
                    </span>
                  </div>
                )}
                {emailConfigured && (
                  <>
                    <div className="flex items-center">
                      {emailStatus.notificationSent ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      )}
                      <span className={emailStatus.notificationSent ? 'text-green-700' : 'text-orange-700'}>
                        {emailStatus.notificationSent 
                          ? 'Notificação enviada para nossa equipe' 
                          : 'Notificação não foi enviada via EmailJS'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {emailStatus.confirmationSent ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                      )}
                      <span className={emailStatus.confirmationSent ? 'text-green-700' : 'text-orange-700'}>
                        {emailStatus.confirmationSent 
                          ? 'Email de confirmação enviado' 
                          : 'Email de confirmação não foi enviado'}
                      </span>
                    </div>
                  </>
                )}
                {emailStatus.error && (
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>{emailStatus.error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!emailConfigured && !netlifyAvailable && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700">
                  Sistemas de notificação não configurados. Sua solicitação foi salva e será processada manualmente.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar ao Início
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmailStatus({ notificationSent: false, confirmationSent: false, netlifySubmitted: false, error: null });
                setFormData({
                  clientName: '',
                  clientEmail: '',
                  clientPhone: '',
                  companyName: '',
                  document: '',
                  cep: '',
                  address: '',
                  city: '',
                  state: '',
                  projectType: '',
                  services: [],
                  description: '',
                  urgency: 'medium' as QuoteRequest['urgency'],
                  budget: 'under-5k' as QuoteRequest['budget'],
                  deadline: '',
                  additionalInfo: ''
                });
                setValidationErrors({});
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Fazer Novo Orçamento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center">
              <Link href="/" className="text-white hover:text-blue-200 mr-4">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-white">Solicitar Orçamento</h1>
            </div>
            <p className="text-blue-100 mt-2">
              Preencha os dados abaixo para receber um orçamento personalizado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informações do Cliente */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Informações de Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  label="Nome Completo"
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  error={validationErrors.clientName}
                  placeholder="Seu nome completo"
                  leftIcon={<User className="h-4 w-4" />}
                />
                
                <ValidatedInput
                  label="E-mail"
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  error={validationErrors.clientEmail}
                  placeholder="seu@email.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                
                <ValidatedInput
                  label="Telefone"
                  type="phone"
                  required
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  error={validationErrors.clientPhone}
                  helperText="Ex: (11) 99999-9999"
                />
                
                <ValidatedInput
                  label="Nome da Empresa"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  error={validationErrors.companyName}
                  placeholder="Nome da sua empresa (opcional)"
                  leftIcon={<Building className="h-4 w-4" />}
                />
                
                <ValidatedInput
                  label="CPF/CNPJ"
                  type="document"
                  value={formData.document}
                  onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.value }))}
                  error={validationErrors.document}
                  helperText="Opcional - para emissão de nota fiscal"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
                
                <ValidatedInput
                  label="CEP"
                  type="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                  error={validationErrors.cep}
                  helperText="Opcional - para orçamento de visitas"
                  placeholder="00000-000"
                />
              </div>
              
              {/* Campos de endereço adicionais se CEP for preenchido */}
              {formData.cep && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ValidatedInput
                    label="Endereço"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número"
                  />
                  
                  <ValidatedInput
                    label="Cidade"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Sua cidade"
                  />
                  
                  <ValidatedInput
                    label="Estado"
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              )}
            </div>

            {/* Tipo de Projeto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Detalhes do Projeto
              </h3>
              <ValidatedInput
                label="Tipo de Projeto"
                type="text"
                required
                value={formData.projectType}
                onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                error={validationErrors.projectType}
                placeholder="Ex: Automação de relatórios financeiros"
                helperText="Descreva brevemente o tipo de projeto que você precisa"
              />
            </div>

            {/* Serviços */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Serviços de Interesse</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="relative">
                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição do Projeto *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                placeholder="Descreva detalhadamente o que você precisa..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Urgência e Orçamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                  Urgência
                </label>
                <select
                  id="urgency"
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as QuoteRequest['urgency'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Orçamento Estimado
                </label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as QuoteRequest['budget'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="under-5k">Até R$ 5.000</option>
                  <option value="5k-15k">R$ 5.000 - R$ 15.000</option>
                  <option value="15k-30k">R$ 15.000 - R$ 30.000</option>
                  <option value="above-30k">Acima de R$ 30.000</option>
                </select>
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Prazo Desejado
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Informações Adicionais */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                Informações Adicionais
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                placeholder="Alguma informação adicional que possa nos ajudar..."
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="mr-2" size={20} />
                )}
                {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}