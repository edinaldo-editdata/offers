'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/utils/cn';
import { FileText, Home, BarChart3, LogOut, User, LogIn } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  const publicNavItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/orcamentos', label: 'Solicitar Orçamento', icon: FileText },
  ];

  const adminNavItems = [
    { href: '/admin', label: 'Painel Admin', icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ED</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">EditData</span>
                <span className="text-xs text-gray-500">Soluções Inteligentes</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {/* Navegação Pública */}
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Navegação Admin (apenas para admins autenticados) */}
            {isAuthenticated && isAdmin && adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Área de Autenticação */}
            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-200">
              {isAuthenticated ? (
                <>
                  {/* Informações do Usuário */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>{session.user.name}</span>
                  </div>
                  
                  {/* Botão de Logout */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                /* Botão de Login para não autenticados */
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <LogIn size={16} />
                  <span>Login Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;