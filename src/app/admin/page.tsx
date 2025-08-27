'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { QuoteRequest, Quote } from '@/types';
import { getQuoteRequests, getQuotes, saveQuoteRequest, saveQuote, deleteQuoteRequest, formatCurrency, formatDate, generateId } from '@/utils/storage';
import { Eye, Trash2, XCircle, FileText, Plus, Lock, User } from 'lucide-react';

export default function AdminPage() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'quotes'>('requests');
  
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Verificar autenticação
  useEffect(() => {
    if (status === 'loading') return; // Ainda carregando
    
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
  }, [session, status, router]);
  
  // Carregar dados
  useEffect(() => {
    setQuoteRequests(getQuoteRequests());
    setQuotes(getQuotes());
  }, []);
  
  // Mostrar loading enquanto verifica autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Mostrar tela de acesso negado se não for admin
  if (!session || session.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <Lock size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página. 
            Apenas administradores podem visualizar o painel administrativo.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setQuoteRequests(getQuoteRequests());
    setQuotes(getQuotes());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-review': return 'Em Análise';
      case 'quoted': return 'Orçamento Enviado';
      case 'accepted': return 'Aceito';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const updateRequestStatus = (id: string, status: QuoteRequest['status']) => {
    const updatedRequests = quoteRequests.map(req =>
      req.id === id ? { ...req, status, updatedAt: new Date().toISOString() } : req
    );
    setQuoteRequests(updatedRequests);
    updatedRequests.forEach(req => saveQuoteRequest(req));
  };

  const deleteRequest = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      deleteQuoteRequest(id);
      setQuoteRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  const QuoteForm = ({ request }: { request: QuoteRequest }) => {
    const [quoteData, setQuoteData] = useState({
      totalValue: 0,
      deliveryTime: '',
      validUntil: '',
      terms: 'Condições padrão de pagamento e entrega.',
      items: [{ description: '', quantity: 1, unitPrice: 0 }]
    });

    const addItem = () => {
      setQuoteData(prev => ({
        ...prev,
        items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
      }));
    };

    const updateItem = (index: number, field: string, value: string | number) => {
      setQuoteData(prev => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }));
    };

    const removeItem = (index: number) => {
      setQuoteData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    };

    const calculateTotal = () => {
      return quoteData.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const quote: Quote = {
        id: generateId(),
        requestId: request.id,
        totalValue: calculateTotal(),
        breakdown: quoteData.items.map(item => ({
          id: generateId(),
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        })),
        deliveryTime: quoteData.deliveryTime,
        validUntil: quoteData.validUntil,
        terms: quoteData.terms,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      saveQuote(quote);
      setQuotes(prev => [...prev, quote]);
      updateRequestStatus(request.id, 'quoted');
      setShowQuoteForm(false);
      setSelectedRequest(null);
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Criar Orçamento</h3>
            <button
              onClick={() => setShowQuoteForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prazo de Entrega
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 15 dias úteis"
                  value={quoteData.deliveryTime}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Válido até
                </label>
                <input
                  type="date"
                  required
                  value={quoteData.validUntil}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Itens do Orçamento
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar Item
                </button>
              </div>
              
              {quoteData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Descrição do item"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qtd"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Valor unitário"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-600 mr-2">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </span>
                    {quoteData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="text-right mt-4">
                <span className="text-lg font-semibold">
                  Total: {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Termos e Condições
              </label>
              <textarea
                rows={3}
                value={quoteData.terms}
                onChange={(e) => setQuoteData(prev => ({ ...prev, terms: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowQuoteForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Criar Orçamento
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho Administrativo */}
        <div className="bg-white shadow-sm rounded-lg mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600 mt-1">Gerencie solicitações de orçamento e propostas</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Logado como</p>
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-blue-600" />
                  <span className="font-medium text-gray-900">{session.user.name}</span>
                </div>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Solicitações ({quoteRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'quotes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orçamentos ({quotes.length})
            </button>
          </nav>
        </div>

        {/* Solicitações */}
        {activeTab === 'requests' && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projeto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quoteRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.clientName}</div>
                          <div className="text-sm text-gray-500">{request.clientEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{request.projectType}</div>
                        <div className="text-sm text-gray-500">
                          {request.services.length} serviço(s) selecionado(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowQuoteForm(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Criar Orçamento"
                          >
                            <FileText size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteRequest(request.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orçamentos */}
        {activeTab === 'quotes' && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Válido até
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {quote.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(quote.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(quote.validUntil)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(quote.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedRequest && !showQuoteForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalhes da Solicitação</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Cliente</h4>
                    <p className="text-gray-900">{selectedRequest.clientName}</p>
                    <p className="text-gray-600">{selectedRequest.clientEmail}</p>
                    <p className="text-gray-600">{selectedRequest.clientPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Empresa</h4>
                    <p className="text-gray-900">{selectedRequest.companyName || 'Não informado'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Projeto</h4>
                  <p className="text-gray-900">{selectedRequest.projectType}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Descrição</h4>
                  <p className="text-gray-900">{selectedRequest.description}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Urgência</h4>
                    <p className="text-gray-900">{selectedRequest.urgency}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Orçamento</h4>
                    <p className="text-gray-900">{selectedRequest.budget}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Prazo</h4>
                    <p className="text-gray-900">{selectedRequest.deadline || 'Não especificado'}</p>
                  </div>
                </div>
                
                {selectedRequest.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-gray-700">Informações Adicionais</h4>
                    <p className="text-gray-900">{selectedRequest.additionalInfo}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Fechar
                </button>
                {selectedRequest.status === 'pending' && (
                  <button
                    onClick={() => setShowQuoteForm(true)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Criar Orçamento
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Criação de Orçamento */}
        {showQuoteForm && selectedRequest && (
          <QuoteForm request={selectedRequest} />
        )}
      </div>
    </div>
  );
}