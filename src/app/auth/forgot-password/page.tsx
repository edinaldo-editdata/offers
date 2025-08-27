'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Erro ao processar solicitação');
      }
    } catch (error) {
      console.error('Erro na recuperação:', error);
      setIsSuccess(false);
      setMessage('Erro de conexão. Tente novamente.');
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
            <Mail size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-600 mt-2">Digite seu email para receber instruções</p>
        </div>

        {!isSuccess ? (
          <>
            {/* Error/Info Message */}
            {message && (
              <div className={`px-4 py-3 rounded-lg mb-6 ${
                isSuccess 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send size={20} className="mr-2" />
                    Enviar Instruções
                  </div>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Success Message */
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Send size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Email enviado!</h3>
              <p className="text-sm">{message}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-4 rounded-lg">
              <h4 className="font-semibold mb-2">Próximos passos:</h4>
              <ul className="text-sm space-y-1 text-left">
                <li>• Verifique sua caixa de entrada</li>
                <li>• Procure na pasta de spam/lixo eletrônico</li>
                <li>• Clique no link de recuperação no email</li>
                <li>• O link é válido por 1 hora</li>
              </ul>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar ao login
          </Link>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Modo Desenvolvimento:</h3>
            <p className="text-xs text-yellow-700">
              Configure as variáveis EMAIL_USER e EMAIL_PASSWORD para funcionalidade completa de email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}