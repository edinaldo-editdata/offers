import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail, verifyPassword, initializeDefaultAdmin } from '@/utils/auth';

export const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔑 NextAuth: Tentando autorizar usuário:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ NextAuth: Credenciais não fornecidas');
          return null;
        }

        try {
          // Garantir que existe um admin padrão
          console.log('🔧 NextAuth: Inicializando admin padrão...');
          await initializeDefaultAdmin();
          
          // Buscar usuário
          console.log('🔍 NextAuth: Buscando usuário:', credentials.email);
          const user = getUserByEmail(credentials.email);
          
          if (!user) {
            console.log('❌ NextAuth: Usuário não encontrado');
            return null;
          }
          
          if (!user.isActive) {
            console.log('❌ NextAuth: Usuário inativo');
            return null;
          }

          // Verificar senha
          console.log('🔐 NextAuth: Verificando senha...');
          const isPasswordValid = await verifyPassword(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('❌ NextAuth: Senha inválida');
            return null;
          }

          // Atualizar último login
          user.lastLogin = new Date().toISOString();
          user.updatedAt = new Date().toISOString();
          
          console.log('✅ NextAuth: Autenticação bem-sucedida para:', user.email);
          
          // Não incluir a senha na sessão
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('🚨 NextAuth: Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 horas
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas
  },

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      console.log('🎫 NextAuth JWT Callback:', { user: user?.email, hasToken: !!token });
      if (user) {
        token.role = user.role;
        token.id = user.id;
        console.log('🎫 Token atualizado com role:', user.role);
      }
      return token;
    },
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      console.log('📋 NextAuth Session Callback:', { sessionUser: session.user?.email, tokenRole: token.role });
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        console.log('📋 Sessão atualizada:', { id: session.user.id, role: session.user.role });
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  events: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user }: any) {
      console.log(`Usuário ${user.email} fez login`);
    },
    async signOut() {
      console.log(`Usuário fez logout`);
    },
  },
};