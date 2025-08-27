import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createPasswordResetRequest } from '@/utils/auth';
import { sendPasswordResetEmail } from '@/utils/email-auth';
import { isValidEmail } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validar email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const user = getUserByEmail(email);
    if (!user) {
      // Por segurança, sempre retornamos sucesso mesmo se o usuário não existir
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá instruções para recuperação da senha.'
      });
    }

    // Criar token de recuperação
    const resetRequest = createPasswordResetRequest(email);

    // Enviar email de recuperação
    const emailResult = await sendPasswordResetEmail(
      email,
      resetRequest.token,
      user.name
    );

    if (!emailResult.success) {
      console.error('Erro ao enviar email:', emailResult.message);
      return NextResponse.json(
        { success: false, message: 'Erro ao enviar email. Tente novamente mais tarde.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá instruções para recuperação da senha.'
    });

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}