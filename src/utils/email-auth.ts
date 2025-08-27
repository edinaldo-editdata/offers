import nodemailer from 'nodemailer';

// Configuração do transporter (usando Gmail por padrão)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Template de email para recuperação de senha
const getPasswordResetEmailTemplate = (resetUrl: string, userName: string) => {
  return {
    subject: 'Recuperação de Senha - EditData Offers',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Recuperação de Senha</title>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f9fafb; }
          .button { 
            display: inline-block; 
            background-color: #2563eb; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
          }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .warning { 
            background-color: #fef3c7; 
            border: 1px solid #f59e0b; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EditData Offers</h1>
            <p>Recuperação de Senha</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            <p>Você solicitou a recuperação de senha para sua conta no sistema EditData Offers.</p>
            <p>Para redefinir sua senha, clique no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link é válido por apenas 1 hora</li>
                <li>Use o link apenas uma vez</li>
                <li>Se você não solicitou esta recuperação, ignore este email</li>
              </ul>
            </div>
            
            <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>© ${new Date().getFullYear()} EditData Offers - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Recuperação de Senha - EditData Offers
      
      Olá, ${userName}!
      
      Você solicitou a recuperação de senha para sua conta no sistema EditData Offers.
      
      Para redefinir sua senha, acesse o link abaixo:
      ${resetUrl}
      
      IMPORTANTE:
      - Este link é válido por apenas 1 hora
      - Use o link apenas uma vez
      - Se você não solicitou esta recuperação, ignore este email
      
      ---
      Este é um email automático, não responda a esta mensagem.
      © ${new Date().getFullYear()} EditData Offers - Todos os direitos reservados
    `
  };
};

// Enviar email de recuperação de senha
export async function sendPasswordResetEmail(
  email: string, 
  token: string, 
  userName: string = 'Usuário'
): Promise<{ success: boolean; message: string }> {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Variáveis de ambiente de email não configuradas');
      return {
        success: false,
        message: 'Configuração de email não encontrada'
      };
    }

    const transporter = createTransporter();
    
    // URL de reset (ajustar para o domínio correto em produção)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
    
    const emailTemplate = getPasswordResetEmailTemplate(resetUrl, userName);
    
    const mailOptions = {
      from: {
        name: 'EditData Offers',
        address: process.env.EMAIL_USER!
      },
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    };

    await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'Email de recuperação enviado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    return {
      success: false,
      message: 'Erro ao enviar email. Tente novamente mais tarde.'
    };
  }
}

// Função para testar configuração de email
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Erro na configuração de email:', error);
    return false;
  }
}