import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Middleware simplificado para debug
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    
    console.log('🚬 Middleware:', { pathname, hasToken: !!token, role: token?.role });

    // Proteger rotas admin
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        console.log('🚫 Acesso negado para:', pathname);
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      console.log('✅ Acesso autorizado para:', pathname);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Permitir acesso total a rotas de autenticação
        if (pathname.startsWith('/api/auth/')) {
          console.log('🔓 Permitindo acesso a rota de auth:', pathname);
          return true;
        }
        
        // Permitir acesso a rotas públicas
        if (
          pathname.startsWith('/auth/') ||
          pathname === '/' ||
          pathname.startsWith('/orcamentos') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon') ||
          pathname.startsWith('/public')
        ) {
          return true;
        }

        // Para rotas protegidas, verificar se há token
        if (pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas as rotas exceto:
     * - api/auth (rotas de autenticação do NextAuth)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone do site)
     * - arquivos públicos
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|scripts).*)',
  ],
};