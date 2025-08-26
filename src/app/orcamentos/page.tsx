'use client';

import { useState } from 'react';
import { QuoteRequest } from '@/types';
import { saveQuoteRequest, getServices, generateId, getSelectedServiceNames } from '@/utils/storage';
import { sendQuoteNotificationEmail, sendClientConfirmationEmail, isEmailConfigured } from '@/utils/email';
import { submitToNetlifyForms, isNetlifyFormsAvailable } from '@/utils/netlify-forms';
import { CheckCircle, Send, ArrowLeft, Mail, AlertCircle } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    projectType: '',
    services: [] as string[],
    description: '',
    urgency: 'medium' as QuoteRequest['urgency'],
    budget: 'under-5k' as QuoteRequest['budget'],
    deadline: '',
    additionalInfo: ''
  });

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
    setIsLoading(true);
    setEmailStatus({ notificationSent: false, confirmationSent: false, netlifySubmitted: false, error: null });

    try {
      const quoteRequest: QuoteRequest = {
        id: generateId(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Salvar no localStorage
      saveQuoteRequest(quoteRequest);

      // Obter nomes dos serviços selecionados
      const selectedServiceNames = getSelectedServiceNames(formData.services);

      let notificationSent = false;
      let confirmationSent = false;
      let netlifySubmitted = false;
      let errorMessage: string | null = null;

      // Tentar enviar via Netlify Forms primeiro (mais confiável)
      if (netlifyAvailable) {
        try {
          netlifySubmitted = await submitToNetlifyForms(quoteRequest, selectedServiceNames);
          if (!netlifySubmitted) {
            console.warn('Falha ao enviar via Netlify Forms');
          }
        } catch (netlifyError) {
          console.error('Erro no Netlify Forms:', netlifyError);
        }
      }

      // Tentar enviar emails se EmailJS estiver configurado
      if (emailConfigured) {
        try {
          // Enviar notificação para a empresa
          notificationSent = await sendQuoteNotificationEmail(
            quoteRequest,
            selectedServiceNames
          );

          // Enviar confirmação para o cliente
          confirmationSent = await sendClientConfirmationEmail(quoteRequest);
        } catch (emailError) {
          console.error('Erro no envio de emails:', emailError);
          errorMessage = 'Erro ao enviar emails de notificação';
        }
      }

      // Se nenhum método funcionou, definir erro
      if (!netlifySubmitted && !notificationSent && !emailConfigured && !netlifyAvailable) {
        errorMessage = 'Nenhum sistema de notificação está configurado';
      }

      setEmailStatus({
        notificationSent,
        confirmationSent,
        netlifySubmitted,
        error: errorMessage
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
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
                  projectType: '',
                  services: [],
                  description: '',
                  urgency: 'medium' as QuoteRequest['urgency'],
                  budget: 'under-5k' as QuoteRequest['budget'],
                  deadline: '',
                  additionalInfo: ''
                });
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="clientPhone"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Tipo de Projeto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes do Projeto</h3>
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
                  Tipo de Projeto *
                </label>
                <input
                  type="text"
                  id="projectType"
                  required
                  placeholder="Ex: Automação de relatórios financeiros"
                  value={formData.projectType}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
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