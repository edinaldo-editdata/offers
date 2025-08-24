# EditData Soluções Inteligentes - Site de Orçamentos

Um site moderno e profissional para solicitação e gerenciamento de orçamentos, desenvolvido especificamente para a EditData Soluções Inteligentes.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Biblioteca de ícones
- **localStorage** - Persistência de dados local (compatível com Netlify)

## 🎯 Funcionalidades

### Para Clientes
- ✅ Página inicial profissional com informações da empresa
- ✅ Formulário de solicitação de orçamento interativo
- ✅ Seleção de serviços disponíveis
- ✅ Design responsivo e moderno
- ✅ Confirmação de envio

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Visualização de todas as solicitações
- ✅ Criação de orçamentos detalhados
- ✅ Gerenciamento de status
- ✅ Sistema de persistência de dados

## 🛠️ Instalação e Desenvolvimento

1. **Clone o repositório ou instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse o site:**
   - Página inicial: http://localhost:3000
   - Formulário de orçamento: http://localhost:3000/orcamentos
   - Painel admin: http://localhost:3000/admin

## 🌐 Deploy no Netlify

### Opção 1: Deploy Automático via Git
1. Faça push do código para um repositório Git (GitHub, GitLab, etc.)
2. Conecte o repositório no Netlify
3. O deploy será automático com as configurações do `netlify.toml`

### Opção 2: Deploy Manual
1. **Build do projeto:**
   ```bash
   npm run build
   ```

2. **Deploy da pasta `.next`:**
   - Arraste a pasta `.next` para o Netlify
   - Ou use o Netlify CLI:
   ```bash
   npx netlify deploy --prod --dir=.next
   ```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── admin/              # Painel administrativo
│   ├── orcamentos/          # Formulário de orçamentos
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página inicial
├── components/
│   └── Navigation.tsx       # Componente de navegação
├── types/
│   └── index.ts             # Tipos TypeScript
└── utils/
    ├── cn.ts                # Utilitário para classes CSS
    └── storage.ts           # Funções de persistência
```

## 🎨 Personalização

### Cores da Marca
O site utiliza uma paleta de cores azul profissional. Para alterar:
- Edite as classes Tailwind nos componentes
- As cores principais estão em `bg-blue-600`, `text-blue-600`, etc.

### Serviços Oferecidos
Para modificar os serviços disponíveis:
1. Edite a função `getDefaultServices()` em `src/utils/storage.ts`
2. Adicione/remova/modifique os serviços conforme necessário

### Informações da Empresa
Atualize as informações da empresa em:
- `src/app/page.tsx` - Página inicial
- `src/app/layout.tsx` - Metadados
- `src/components/Navigation.tsx` - Logo e nome

## 💾 Persistência de Dados

O sistema utiliza localStorage para armazenar:
- ✅ Solicitações de orçamento
- ✅ Orçamentos criados
- ✅ Configurações de serviços

**Vantagens para Netlify:**
- Não requer banco de dados
- Funciona em sites estáticos
- Dados persistem no navegador do usuário

## 🔒 Considerações de Segurança

Para produção, considere implementar:
- Autenticação para o painel admin
- Validação server-side dos formulários
- Rate limiting para prevenção de spam
- Integração com serviços de email para notificações

## 📧 Próximos Passos

1. **Integração de Email:**
   - Netlify Forms para receber notificações
   - EmailJS para envio automático
   - SendGrid ou similar para emails transacionais

2. **Analytics:**
   - Google Analytics
   - Netlify Analytics

3. **SEO:**
   - Sitemap automático
   - Meta tags otimizadas
   - Schema.org markup

## 📞 Suporte

Para dúvidas ou suporte técnico:
- Email: contato@editdata.com.br
- Telefone: (11) 99999-9999

---

**Desenvolvido com ❤️ para EditData Soluções Inteligentes**
