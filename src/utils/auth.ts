import bcrypt from 'bcryptjs';
import { User, PasswordResetRequest } from '@/types';
import { generateId } from './storage';

// Configurações de segurança
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY_HOURS = 1; // 1 hora para reset de senha

// Hash da senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Gerar token seguro para reset de senha
export function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Validar formato de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar força da senha
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Funções de armazenamento de usuários (híbrido: servidor/cliente)
export function getUsers(): User[] {
  // No servidor (NextAuth) - importação dinâmica para evitar erro no cliente
  if (typeof window === 'undefined') {
    try {
      // Importação dinâmica somente no servidor
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getUsersFromFile } = require('./auth-server');
      return getUsersFromFile();
    } catch (error) {
      console.error('🚨 Erro ao carregar funções do servidor:', error);
      return [];
    }
  }
  
  // No cliente (browser)
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

export function saveUser(user: User): void {
  // No servidor (NextAuth) - importação dinâmica para evitar erro no cliente
  if (typeof window === 'undefined') {
    try {
      // Importação dinâmica somente no servidor
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveUserToFile } = require('./auth-server');
      saveUserToFile(user);
    } catch (error) {
      console.error('🚨 Erro ao carregar funções do servidor:', error);
    }
    return;
  }
  
  // No cliente (browser)
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

// Funções para gerenciamento de tokens de reset
export function getPasswordResetRequests(): PasswordResetRequest[] {
  // No servidor (NextAuth) - importação dinâmica para evitar erro no cliente
  if (typeof window === 'undefined') {
    try {
      // Importação dinâmica somente no servidor
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getPasswordResetRequestsFromFile } = require('./auth-server');
      return getPasswordResetRequestsFromFile();
    } catch (error) {
      console.error('🚨 Erro ao carregar funções do servidor:', error);
      return [];
    }
  }
  
  // No cliente (browser)
  const requests = localStorage.getItem('passwordResetRequests');
  return requests ? JSON.parse(requests) : [];
}

export function savePasswordResetRequest(request: PasswordResetRequest): void {
  // No servidor (NextAuth) - importação dinâmica para evitar erro no cliente
  if (typeof window === 'undefined') {
    try {
      // Importação dinâmica somente no servidor
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { savePasswordResetRequestToFile } = require('./auth-server');
      savePasswordResetRequestToFile(request);
    } catch (error) {
      console.error('🚨 Erro ao carregar funções do servidor:', error);
    }
    return;
  }
  
  // No cliente (browser)
  const requests = getPasswordResetRequests();
  const existingIndex = requests.findIndex(r => r.id === request.id);
  
  if (existingIndex >= 0) {
    requests[existingIndex] = request;
  } else {
    requests.push(request);
  }
  
  localStorage.setItem('passwordResetRequests', JSON.stringify(requests));
}

export function getPasswordResetRequestByToken(token: string): PasswordResetRequest | null {
  const requests = getPasswordResetRequests();
  return requests.find(request => 
    request.token === token && 
    !request.used && 
    new Date(request.expiresAt) > new Date()
  ) || null;
}

export function createPasswordResetRequest(email: string): PasswordResetRequest {
  const token = generateResetToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);
  
  const request: PasswordResetRequest = {
    id: generateId(),
    email,
    token,
    expiresAt: expiresAt.toISOString(),
    used: false,
    createdAt: new Date().toISOString()
  };
  
  savePasswordResetRequest(request);
  return request;
}

export function markPasswordResetAsUsed(token: string): boolean {
  const request = getPasswordResetRequestByToken(token);
  if (!request) return false;
  
  request.used = true;
  savePasswordResetRequest(request);
  return true;
}

// Criar usuário admin padrão se não existir
export async function initializeDefaultAdmin(): Promise<void> {
  const users = getUsers();
  const adminExists = users.some(user => user.role === 'admin');
  
  if (!adminExists) {
    const defaultAdmin: User = {
      id: generateId(),
      email: 'admin@editdata.com.br',
      name: 'Administrador',
      password: await hashPassword('Admin123!'),
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveUser(defaultAdmin);
  }
}