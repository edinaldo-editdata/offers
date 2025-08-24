import Link from "next/link";
import { ArrowRight, BarChart3, Cog, Database, FileSpreadsheet, Zap, TrendingUp } from "lucide-react";

export default function Home() {
  const services = [
    {
      icon: FileSpreadsheet,
      title: "Automação de Planilhas",
      description: "Criação de macros e automações para Excel e Google Sheets, eliminando tarefas repetitivas."
    },
    {
      icon: Database,
      title: "Tratamento de Dados",
      description: "Limpeza, formatação e estruturação de bases de dados para análises precisas."
    },
    {
      icon: BarChart3,
      title: "Dashboards Personalizados",
      description: "Criação de dashboards interativos e relatórios automáticos para tomada de decisões."
    },
    {
      icon: Cog,
      title: "Otimização de Processos",
      description: "Análise e otimização de processos internos com scripts e automações inteligentes."
    },
    {
      icon: Zap,
      title: "Fórmulas Personalizadas",
      description: "Desenvolvimento de fórmulas complexas e funções customizadas para suas necessidades."
    },
    {
      icon: TrendingUp,
      title: "Integração de Sistemas",
      description: "Conectar diferentes sistemas e automatizar fluxos de dados entre plataformas."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              EditData Soluções Inteligentes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Especialistas em automação de planilhas, tratamento de dados e otimização de processos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/orcamentos"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Solicitar Orçamento
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="#servicos"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Nossos Serviços
              </a>
            </div>
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
      <section id="servicos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-gray-600">
              Oferecemos soluções completas para otimizar seus processos de trabalho
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar seus processos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Solicite um orçamento gratuito e descubra como podemos otimizar seu negócio
          </p>
          <Link
            href="/orcamentos"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Solicitar Orçamento Gratuito
            <ArrowRight className="ml-2" size={20} />
          </Link>
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
