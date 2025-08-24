import { QuoteRequest, Quote, ServiceType } from '@/types';

const STORAGE_KEYS = {
  QUOTE_REQUESTS: 'editdata_quote_requests',
  QUOTES: 'editdata_quotes',
  SERVICES: 'editdata_services'
};

// Funções para QuoteRequests
export const getQuoteRequests = (): QuoteRequest[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.QUOTE_REQUESTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuoteRequest = (request: QuoteRequest): void => {
  if (typeof window === 'undefined') return;
  const requests = getQuoteRequests();
  const existingIndex = requests.findIndex(r => r.id === request.id);
  
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.push(request);
  }
  
  localStorage.setItem(STORAGE_KEYS.QUOTE_REQUESTS, JSON.stringify(requests));
};

export const deleteQuoteRequest = (id: string): void => {
  if (typeof window === 'undefined') return;
  const requests = getQuoteRequests().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUOTE_REQUESTS, JSON.stringify(requests));
};

// Funções para Quotes
export const getQuotes = (): Quote[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.QUOTES);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuote = (quote: Quote): void => {
  if (typeof window === 'undefined') return;
  const quotes = getQuotes();
  const existingIndex = quotes.findIndex(q => q.id === quote.id);
  
  if (existingIndex >= 0) {
    quotes[existingIndex] = quote;
  } else {
    quotes.push(quote);
  }
  
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
};

export const deleteQuote = (id: string): void => {
  if (typeof window === 'undefined') return;
  const quotes = getQuotes().filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
};

// Funções para Services
export const getServices = (): ServiceType[] => {
  if (typeof window === 'undefined') return getDefaultServices();
  const stored = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return stored ? JSON.parse(stored) : getDefaultServices();
};

export const saveServices = (services: ServiceType[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

const getDefaultServices = (): ServiceType[] => [
  {
    id: '1',
    name: 'Automação de Planilhas',
    description: 'Criação de macros e automações para Excel/Google Sheets',
    basePrice: 500,
    category: 'automation'
  },
  {
    id: '2',
    name: 'Tratamento de Dados',
    description: 'Limpeza, formatação e estruturação de bases de dados',
    basePrice: 800,
    category: 'data-processing'
  },
  {
    id: '3',
    name: 'Dashboard Personalizado',
    description: 'Criação de dashboards interativos e relatórios automáticos',
    basePrice: 1200,
    category: 'automation'
  },
  {
    id: '4',
    name: 'Otimização de Processos',
    description: 'Análise e otimização de processos internos com scripts',
    basePrice: 1000,
    category: 'optimization'
  },
  {
    id: '5',
    name: 'Fórmulas Personalizadas',
    description: 'Desenvolvimento de fórmulas complexas e funções customizadas',
    basePrice: 300,
    category: 'custom'
  },
  {
    id: '6',
    name: 'Integração de Sistemas',
    description: 'Conectar diferentes sistemas e automatizar fluxos de dados',
    basePrice: 1500,
    category: 'automation'
  }
];

// Utilitários gerais
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};