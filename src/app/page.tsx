import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Cog, Database, FileSpreadsheet, Zap, TrendingUp, Sparkles, Clock, DollarSign } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: FileSpreadsheet,
      title: "Automação de Planilhas",
      description: "Criação de macros e automações para Excel e Google Sheets, eliminando tarefas repetitivas.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format",
      case: "Empresa reduziu 15h/semana em relatórios financeiros"
    },
    {
      icon: Database,
      title: "Tratamento de Dados",
      description: "Limpeza, formatação e estruturação de bases de dados para análises precisas.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format",
      case: "Base com 50K registros processada em minutos"
    },
    {
      icon: BarChart3,
      title: "Dashboards Personalizados",
      description: "Criação de dashboards interativos e relatórios automáticos para tomada de decisões.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format",
      case: "Dashboard em tempo real para 5 filiais"
    },
    {
      icon: Cog,
      title: "Otimização de Processos",
      description: "Análise e otimização de processos internos com scripts e automações inteligentes.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop&auto=format",
      case: "Processo de estoque automatizado 100%"
    },
    {
      icon: Zap,
      title: "Fórmulas Personalizadas",
      description: "Desenvolvimento de fórmulas complexas e funções customizadas para suas necessidades.",
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=250&fit=crop&auto=format",
      case: "Sistema de cálculo de comissões complexas"
    },
    {
      icon: TrendingUp,
      title: "Integração de Sistemas",
      description: "Conectar diferentes sistemas e automatizar fluxos de dados entre plataformas.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop&auto=format",
      case: "ERP integrado com e-commerce em tempo real"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Criamos na velocidade do seu pensamento",
      description: "Conte sua ideia para a EditData e veja ela se transformar em uma solução automatizada funcional - completa com todos os componentes, processos e recursos necessários.",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: Clock,
      title: "A infraestrutura já está pronta",
      description: "Tudo que sua solução precisa para funcionar, como integração de dados, automações de processo ou criação de relatórios personalizados é cuidado nos bastidores.",
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      icon: DollarSign,
      title: "Pronto para usar, instantaneamente",
      description: "Nossas soluções vêm com implementação completa, então quando sua automação estiver pronta, você só precisa colocá-la em uso e compartilhar com sua equipe.",
      gradient: "from-green-400 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Transforme sua ideia em realidade. Agora mesmo.
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-50 max-w-4xl mx-auto">
              A EditData permite que você construa soluções de automação totalmente funcionais em minutos, apenas com suas palavras. Nenhuma programação necessária.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                href="/orcamentos"
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-10 py-4 rounded-xl font-semibold hover:from-orange-500 hover:to-red-500 transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-xl"
              >
                Começar Agora
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="#exemplos"
                className="border-2 border-white/30 backdrop-blur-sm bg-white/10 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Ver Exemplos
              </a>
            </div>
            
            {/* Quick Examples */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                "Dashboard Financeiro",
                "Automação de Relatórios", 
                "Sistema de Estoque",
                "Integração ERP",
                "Análise de Dados"
              ].map((item, index) => (
                <button
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Base44 Style */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Considere-se sem limites.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Se você pode descrever, nós podemos automatizar.
            </p>
          </div>
          
          <div className="space-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                  <div className="flex-1">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    <Link
                      href="/orcamentos"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      Começar a construir
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className={`h-80 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white text-center p-8`}>
                      <div>
                        <div className="text-6xl mb-4">📊</div>
                        <div className="text-lg font-medium">Exemplo Visual da Solução</div>
                        <div className="text-sm opacity-80 mt-2">Dashboard interativo em tempo real</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Transformamos seus processos com tecnologia
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Na EditData, acreditamos que a tecnologia deve simplificar sua rotina de trabalho. 
                Especializamos em criar soluções personalizadas que automatizam tarefas repetitivas, 
                otimizam o tempo de processamento de dados e transformam planilhas em ferramentas poderosas.
              </p>
              <p className="text-lg text-gray-600">
                Nossa expertise inclui desenvolvimento de macros avançadas, criação de dashboards 
                interativos, integração entre sistemas e muito mais. Cada projeto é único e desenvolvido 
                especificamente para atender às suas necessidades.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Por que escolher a EditData?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Zap className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Soluções 100% personalizadas para seu negócio</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">ROI comprovado com redução de tempo e custos</span>
                </li>
                <li className="flex items-start">
                  <Cog className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={16} />
                  <span className="text-gray-700">Suporte contínuo e treinamento da equipe</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="exemplos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              &quot;Okay, a EditData superou minhas expectativas.&quot;
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              E outras coisas incríveis que nossos clientes dizem sobre nós.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    {/* Case Study Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                      Caso Real
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="text-white" size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Case Example */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center text-xs text-green-700">
                        <Sparkles size={12} className="mr-1" />
                        <span className="font-medium">Resultado:</span>
                      </div>
                      <div className="text-sm text-gray-700 font-medium mt-1">
                        {service.case}
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all text-sm">
                      Solicitar Similar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/orcamentos"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-red-500 transition-all transform hover:scale-105 shadow-xl"
            >
              Começar a construir
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Começar a construir em minutos. Ver resultados imediatamente.
          </h2>
          <p className="text-xl text-blue-50 mb-12 max-w-3xl mx-auto">
            Solicite um orçamento gratuito e descubra como podemos transformar sua ideia em uma solução automatizada funcional
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/orcamentos"
              className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center transform hover:scale-105 shadow-xl"
            >
              Solicitar Orçamento Gratuito
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <a
              href="#exemplos"
              className="border-2 border-white/30 backdrop-blur-sm bg-white/10 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Ver Mais Exemplos
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ED</span>
                </div>
                <span className="text-lg font-bold">EditData</span>
              </div>
              <p className="text-gray-300">
                Soluções inteligentes para automação de planilhas e otimização de processos.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-300 mb-2">contato@editdata.com.br</p>
              <p className="text-gray-300">(11) 99999-9999</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link href="/orcamentos" className="text-gray-300 hover:text-white">Solicitar Orçamento</Link></li>
                <li><Link href="/admin" className="text-gray-300 hover:text-white">Painel Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 EditData Soluções Inteligentes. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
