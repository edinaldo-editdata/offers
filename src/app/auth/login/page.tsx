'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, LogIn, Bug } from 'lucide-react';
import { debugAuthIssues, resetAdminUser, testLogin } from '@/utils/debug-auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  
  const router = useRouter();

  // Debug automático na primeira carga
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Forçar inicialização do admin
        const { initializeDefaultAdmin } = await import('@/utils/auth');
        await initializeDefaultAdmin();
        
        if (process.env.NODE_ENV === 'development') {
          await debugAuthIssues();
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      }
    };
    
    initializeAuth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou senha inválidos');
        return;
      }

      // Verificar se a sessão foi criada com sucesso
      const session = await getSession();
      if (session?.user && 'role' in session.user && session.user.role === 'admin') {
        router.push('/admin');
      } else {
        setError('Acesso não autorizado');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acesso Administrativo</h1>
          <p className="text-gray-600 mt-2">EditData Offers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@editdata.com.br"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-6">
          <Link 
            href="/auth/forgot-password" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Admin Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Credenciais padrão:</h3>
          <p className="text-xs text-gray-600">
            <strong>Email:</strong> admin@editdata.com.br<br />
            <strong>Senha:</strong> Admin123!
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ Altere a senha padrão após o primeiro login
          </p>
          
          {/* Debug Tools - Apenas em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Bug size={12} className="mr-1" />
                {showDebug ? 'Ocultar' : 'Mostrar'} Debug
              </button>
              
              {showDebug && (
                <div className="mt-2 space-y-2">
                  <button
                    type="button"
                    onClick={debugAuthIssues}
                    className="w-full text-xs bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Diagnosticar Autenticação
                  </button>
                  <button
                    type="button"
                    onClick={resetAdminUser}
                    className="w-full text-xs bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Recriar Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => testLogin('admin@editdata.com.br', 'Admin123!')}
                    className="w-full text-xs bg-green-500 text-white py-1 px-2 rounded"
                  >
                    Testar Login Manual
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}