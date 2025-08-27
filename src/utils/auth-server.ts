// Funções de armazenamento exclusivas para o servidor (NextAuth)
import fs from 'fs';
import path from 'path';
import { User, PasswordResetRequest } from '@/types';

// Caminhos para arquivos de dados
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESET_REQUESTS_FILE = path.join(DATA_DIR, 'reset-requests.json');

// Garantir que o diretório de dados existe
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Funções de armazenamento de usuários para o servidor
export function getUsersFromFile(): User[] {
  try {
    ensureDataDir();
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('🚨 Erro ao ler usuários do arquivo:', error);
    return [];
  }
}

export function saveUserToFile(user: User): void {
  try {
    ensureDataDir();
    const users = getUsersFromFile();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('💾 Usuário salvo no arquivo:', user.email);
  } catch (error) {
    console.error('🚨 Erro ao salvar usuário no arquivo:', error);
  }
}

export function getUserByEmailFromFile(email: string): User | null {
  const users = getUsersFromFile();
  return users.find(user => user.email === email) || null;
}

// Funções de reset de senha para o servidor
export function getPasswordResetRequestsFromFile(): PasswordResetRequest[] {
  try {
    ensureDataDir();
    if (fs.existsSync(RESET_REQUESTS_FILE)) {
      const data = fs.readFileSync(RESET_REQUESTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('🚨 Erro ao ler requests de reset:', error);
    return [];
  }
}

export function savePasswordResetRequestToFile(request: PasswordResetRequest): void {
  try {
    ensureDataDir();
    const requests = getPasswordResetRequestsFromFile();
    const existingIndex = requests.findIndex(r => r.id === request.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }
    
    fs.writeFileSync(RESET_REQUESTS_FILE, JSON.stringify(requests, null, 2));
  } catch (error) {
    console.error('🚨 Erro ao salvar request de reset:', error);
  }
}