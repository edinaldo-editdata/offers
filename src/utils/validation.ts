/**
 * Utilitários de validação avançada para formulários brasileiros
 * Inclui validação de CPF/CNPJ, máscaras de input e sanitização de dados
 */

// Tipos para validação
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// =================== VALIDAÇÃO DE CPF/CNPJ ===================

/**
 * Remove caracteres não numéricos de uma string
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida um CPF
 */
export function validateCPF(cpf: string): ValidationResult {
  const cleanCPF = removeNonNumeric(cpf);
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return { isValid: false, message: 'CPF deve ter 11 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return { isValid: false, message: 'CPF inválido' };
  }
  
  return { isValid: true };
}

/**
 * Valida um CNPJ
 */
export function validateCNPJ(cnpj: string): ValidationResult {
  const cleanCNPJ = removeNonNumeric(cnpj);
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return { isValid: false, message: 'CNPJ deve ter 14 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return { isValid: false, message: 'CNPJ inválido' };
  }
  
  // Validação do primeiro dígito verificador
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return { isValid: false, message: 'CNPJ inválido' };
  }
  
  // Validação do segundo dígito verificador
  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return { isValid: false, message: 'CNPJ inválido' };
  }
  
  return { isValid: true };
}

/**
 * Valida CPF ou CNPJ automaticamente baseado no tamanho
 */
export function validateCPFOrCNPJ(document: string): ValidationResult {
  const clean = removeNonNumeric(document);
  
  if (clean.length === 11) {
    return validateCPF(document);
  } else if (clean.length === 14) {
    return validateCNPJ(document);
  } else {
    return { isValid: false, message: 'Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)' };
  }
}

// =================== MÁSCARAS DE INPUT ===================

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export function maskCPF(value: string): string {
  const clean = removeNonNumeric(value);
  return clean
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Aplica máscara de CNPJ: 00.000.000/0000-00
 */
export function maskCNPJ(value: string): string {
  const clean = removeNonNumeric(value);
  return clean
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Aplica máscara de CPF ou CNPJ automaticamente
 */
export function maskCPFOrCNPJ(value: string): string {
  const clean = removeNonNumeric(value);
  
  if (clean.length <= 11) {
    return maskCPF(value);
  } else {
    return maskCNPJ(value);
  }
}

/**
 * Aplica máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
 */
export function maskPhone(value: string): string {
  const clean = removeNonNumeric(value);
  
  if (clean.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return clean
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    // Celular: (00) 00000-0000
    return clean
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
}

/**
 * Aplica máscara de CEP: 00000-000
 */
export function maskCEP(value: string): string {
  const clean = removeNonNumeric(value);
  return clean
    .replace(/(\d{5})(\d{1,3})/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}

// =================== VALIDAÇÕES ESPECÍFICAS ===================

/**
 * Valida formato de telefone brasileiro
 */
export function validatePhone(phone: string): ValidationResult {
  const clean = removeNonNumeric(phone);
  
  if (clean.length < 10 || clean.length > 11) {
    return { isValid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
  }
  
  // Verifica se é um DDD válido (11-99)
  const ddd = parseInt(clean.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return { isValid: false, message: 'DDD inválido' };
  }
  
  return { isValid: true };
}

/**
 * Valida formato de CEP brasileiro
 */
export function validateCEP(cep: string): ValidationResult {
  const clean = removeNonNumeric(cep);
  
  if (clean.length !== 8) {
    return { isValid: false, message: 'CEP deve ter 8 dígitos' };
  }
  
  // Verifica se não é um CEP inválido conhecido
  if (clean === '00000000') {
    return { isValid: false, message: 'CEP inválido' };
  }
  
  return { isValid: true };
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Email inválido' };
  }
  
  return { isValid: true };
}

// =================== SANITIZAÇÃO DE DADOS ===================

/**
 * Sanitiza string removendo caracteres perigosos para prevenir XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove eventos como onclick=
    .replace(/&lt;/g, '') // Remove &lt;
    .replace(/&gt;/g, '') // Remove &gt;
    .replace(/&#x?\d+;/g, '') // Remove entidades HTML numéricas
    .trim();
}

/**
 * Sanitiza objeto completo recursivamente
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as any)[key] = sanitizeString(sanitized[key]);
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitized[key].map((item: any) => 
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  
  return sanitized;
}

// =================== UTILITÁRIOS AUXILIARES ===================

/**
 * Verifica se uma string contém apenas números
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Limita o tamanho de uma string
 */
export function limitLength(value: string, maxLength: number): string {
  return value.length > maxLength ? value.substring(0, maxLength) : value;
}

/**
 * Remove espaços extras e normaliza string
 */
export function normalizeString(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .normalize('NFD') // Normaliza caracteres especiais
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos se necessário
}

/**
 * Conjunto de validações para formulário completo
 */
export interface FormValidationErrors {
  [key: string]: string | undefined;
}

/**
 * Valida um formulário completo
 */
export function validateForm(data: any): FormValidationErrors {
  const errors: FormValidationErrors = {};
  
  // Validação de nome
  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.clientName = 'Nome deve ter pelo menos 2 caracteres';
  }
  
  // Validação de email
  if (!data.clientEmail) {
    errors.clientEmail = 'Email é obrigatório';
  } else {
    const emailValidation = validateEmail(data.clientEmail);
    if (!emailValidation.isValid) {
      errors.clientEmail = emailValidation.message!;
    }
  }
  
  // Validação de telefone
  if (!data.clientPhone) {
    errors.clientPhone = 'Telefone é obrigatório';
  } else {
    const phoneValidation = validatePhone(data.clientPhone);
    if (!phoneValidation.isValid) {
      errors.clientPhone = phoneValidation.message!;
    }
  }
  
  // Validação de CPF/CNPJ se fornecido
  if (data.document) {
    const docValidation = validateCPFOrCNPJ(data.document);
    if (!docValidation.isValid) {
      errors.document = docValidation.message!;
    }
  }
  
  // Validação de CEP se fornecido
  if (data.cep) {
    const cepValidation = validateCEP(data.cep);
    if (!cepValidation.isValid) {
      errors.cep = cepValidation.message!;
    }
  }
  
  return errors;
}