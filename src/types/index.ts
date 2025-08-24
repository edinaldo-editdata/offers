export interface ServiceType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: 'automation' | 'data-processing' | 'optimization' | 'custom';
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  projectType: string;
  services: string[];
  description: string;
  urgency: 'low' | 'medium' | 'high';
  budget: 'under-5k' | '5k-15k' | '15k-30k' | 'above-30k';
  deadline?: string;
  additionalInfo?: string;
  status: 'pending' | 'in-review' | 'quoted' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  requestId: string;
  totalValue: number;
  breakdown: QuoteItem[];
  deliveryTime: string;
  validUntil: string;
  terms: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CompanyInfo {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo?: string;
}