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

// Função auxiliar para criar usuário admin padrão
function getDefaultAdmin(): User {
  return {
    id: '092ct7ap5',
    email: 'admin@editdata.com.br',
    name: 'Administrador',
    password: '$2b$12$gm7w/6riREy29haPHQNXseIPJ5wDd660kHIve2WyKQ5GbQUBtVsom', // Admin123!
    role: 'admin',
    isActive: true,
    createdAt: '2025-08-27T18:52:46.456Z',
    updatedAt: '2025-08-27T18:52:46.456Z'
  };
}

// Funções de armazenamento de usuários (simplificado para produção)
export function getUsers(): User[] {
  // No servidor (NextAuth) - usar dados em memória para produção
  if (typeof window === 'undefined') {
    console.log('🔍 Servidor: Carregando usuários padrão');
    return [getDefaultAdmin()];
  }
  
  // No cliente (browser)
  const users = localStorage.getItem('users');
  const storedUsers = users ? JSON.parse(users) : [];
  
  // Garantir que sempre existe pelo menos o admin padrão
  const adminExists = storedUsers.some((user: User) => user.role === 'admin');
  if (!adminExists) {
    storedUsers.push(getDefaultAdmin());
    localStorage.setItem('users', JSON.stringify(storedUsers));
  }
  
  return storedUsers;
}

export function saveUser(user: User): void {
  // No servidor (NextAuth) - apenas log, não persiste em produção
  if (typeof window === 'undefined') {
    console.log('💾 Servidor: Tentativa de salvar usuário:', user.email);
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

// Funções para gerenciamento de tokens de reset (simplificado)
export function getPasswordResetRequests(): PasswordResetRequest[] {
  // No servidor (NextAuth) - retornar array vazio em produção
  if (typeof window === 'undefined') {
    console.log('🔍 Servidor: Carregando requests de reset (vazio)');
    return [];
  }
  
  // No cliente (browser)
  const requests = localStorage.getItem('passwordResetRequests');
  return requests ? JSON.parse(requests) : [];
}

export function savePasswordResetRequest(request: PasswordResetRequest): void {
  // No servidor (NextAuth) - apenas log, não persiste em produção
  if (typeof window === 'undefined') {
    console.log('💾 Servidor: Tentativa de salvar request de reset:', request.email);
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

// Simplificar inicialização do admin para produção
export async function initializeDefaultAdmin(): Promise<void> {
  console.log('🔧 Inicializando admin padrão...');
  
  // No servidor, sempre garantir que existe o admin padrão
  if (typeof window === 'undefined') {
    console.log('✅ Admin padrão disponível no servidor');
    return;
  }
  
  // No cliente, verificar se precisa criar admin
  const users = getUsers();
  const adminExists = users.some(user => user.role === 'admin');
  
  if (!adminExists) {
    console.log('🔧 Criando admin padrão no cliente...');
    const defaultAdmin = getDefaultAdmin();
    saveUser(defaultAdmin);
    console.log('✅ Admin padrão criado');
  } else {
    console.log('✅ Admin já existe');
  }
}