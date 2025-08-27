import { NextRequest, NextResponse } from 'next/server';
import { 
  getPasswordResetRequestByToken, 
  markPasswordResetAsUsed,
  getUserByEmail,
  hashPassword,
  saveUser,
  validatePassword
} from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    // Validar dados de entrada
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'As senhas não coincidem' },
        { status: 400 }
      );
    }

    // Validar força da senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Senha não atende aos critérios de segurança',
          errors: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Verificar token de recuperação
    const resetRequest = getPasswordResetRequestByToken(token);
    if (!resetRequest) {
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = getUserByEmail(resetRequest.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Criptografar nova senha
    const hashedPassword = await hashPassword(password);

    // Atualizar senha do usuário
    user.password = hashedPassword;
    user.updatedAt = new Date().toISOString();
    saveUser(user);

    // Marcar token como usado
    markPasswordResetAsUsed(token);

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso. Você pode fazer login com a nova senha.'
    });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}