// Utilitário para debug de problemas de autenticação
import { getUsers, getUserByEmail, initializeDefaultAdmin } from './auth';

export async function debugAuthIssues() {
  console.log('🔍 DEBUG: Iniciando diagnóstico de autenticação...');
  
  try {
    // 1. Verificar se estamos no lado cliente
    if (typeof window === 'undefined') {
      console.log('❌ Executando no servidor - localStorage não disponível');
      return;
    }
    
    // 2. Inicializar admin padrão
    console.log('🔧 Inicializando admin padrão...');
    await initializeDefaultAdmin();
    
    // 3. Verificar usuários no localStorage
    const users = getUsers();
    console.log('👥 Usuários encontrados:', users.length);
    console.log('📊 Lista de usuários:', users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      hasPassword: !!u.password
    })));
    
    // 4. Verificar admin específico
    const admin = getUserByEmail('admin@editdata.com.br');
    if (admin) {
      console.log('✅ Admin encontrado:', {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        hasPassword: !!admin.password,
        passwordLength: admin.password?.length || 0
      });
    } else {
      console.log('❌ Admin não encontrado!');
    }
    
    // 5. Verificar localStorage diretamente
    const usersInStorage = localStorage.getItem('users');
    console.log('💾 Dados brutos no localStorage:', usersInStorage);
    
  } catch (error) {
    console.error('💥 Erro durante debug:', error);
  }
}

// Função para limpar e recriar admin
export async function resetAdminUser() {
  try {
    console.log('🔄 Resetando usuário admin...');
    
    // Limpar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('users');
      console.log('🗑️ localStorage limpo');
    }
    
    // Recriar admin
    await initializeDefaultAdmin();
    console.log('✅ Admin recriado com sucesso');
    
    // Verificar
    const admin = getUserByEmail('admin@editdata.com.br');
    console.log('👤 Novo admin:', admin ? 'Criado' : 'Falhou');
    
    return admin;
  } catch (error) {
    console.error('💥 Erro ao resetar admin:', error);
    return null;
  }
}

// Função para testar login manualmente
export async function testLogin(email: string, password: string) {
  console.log('🧪 Testando login manual...');
  console.log('📧 Email:', email);
  console.log('🔑 Senha length:', password.length);
  
  try {
    const { verifyPassword } = await import('./auth');
    
    const user = getUserByEmail(email);
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return false;
    }
    
    console.log('👤 Usuário encontrado:', {
      email: user.email,
      isActive: user.isActive,
      role: user.role
    });
    
    if (!user.isActive) {
      console.log('❌ Usuário inativo');
      return false;
    }
    
    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('🔐 Senha válida:', isPasswordValid);
    
    return isPasswordValid;
  } catch (error) {
    console.error('💥 Erro no teste de login:', error);
    return false;
  }
}