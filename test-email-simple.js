// Teste simples do EmailJS
const testEmailJS = async () => {
  console.log('🔍 Teste simples EmailJS...');

  // Verificar se estamos no navegador
  if (typeof window === 'undefined') {
    console.log('❌ Rodando no servidor, EmailJS precisa do navegador');
    return;
  }

  try {
    // Importar EmailJS
    console.log('📦 Importando EmailJS...');
    const { default: emailjs } = await import('@emailjs/browser');
    
    if (!emailjs) {
      console.log('❌ EmailJS não carregou');
      return;
    }

    console.log('✅ EmailJS importado:', typeof emailjs);
    console.log('✅ Métodos disponíveis:', Object.keys(emailjs));

    // Verificar variáveis
    const config = {
      serviceId: 'service_editdata_offers',
      templateId: 'template_quote_notification', 
      publicKey: 'yj42PJzyGOZpxcWk1'
    };

    console.log('📋 Config:', config);

    // Inicializar
    console.log('🔧 Inicializando...');
    emailjs.init(config.publicKey);
    console.log('✅ Inicializado');

    // Dados de teste
    const testData = {
      client_name: 'João Teste',
      client_email: 'edinaldobl@editdata.com.br',
      project_type: 'Teste Sistema',
      services: 'Automação'
    };

    console.log('📧 Enviando...');
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      testData
    );

    console.log('🎉 SUCESSO!', response);

  } catch (error) {
    console.log('❌ ERRO:', error);
    console.log('Detalhes:', error.message);
    console.log('Stack:', error.stack);
  }
};

// Executar quando carregar a página
if (typeof window !== 'undefined') {
  window.testEmailJS = testEmailJS;
  console.log('✅ Função testEmailJS() disponível no console');
}