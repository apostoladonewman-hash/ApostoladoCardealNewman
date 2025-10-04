# Apostolado Cardeal Newman

## 📖 Sobre o Projeto
O **Apostolado Cardeal Newman** é uma plataforma de conteúdo digital desenvolvida para disseminar artigos, livros e informações relacionadas ao processo de conversão de ex-protestantes à fé católica.  

A aplicação é dividida em duas partes principais:
- **Backend (CMS)**: construído com **Strapi** para o gerenciamento de todo o conteúdo.
- **Frontend**: construído com **React** e **TypeScript** para a exibição dos dados aos usuários.

---

## ✨ Funcionalidades Principais

### Gestão de Conteúdo via CMS
- Criação, edição e exclusão de Artigos, Livros, Autores e Categorias.  
- Gerenciamento de conteúdo global do site (links de rodapé, informações de contato, etc.).  
- Área administrativa para gestão de todo o conteúdo.  

### Autenticação de Usuários
- Sistema de Registro e Login para usuários.  
- Painel de usuário para gerenciamento de perfil e contribuições.  
- Rotas protegidas e permissões baseadas em *roles*.  

### Área Pública
- Página inicial com destaques e artigos recentes.  
- Seção de Artigos com filtros por categoria e busca por título.  
- Página de Biblioteca para visualização dos livros disponíveis.  
- Páginas de conteúdo sobre o Apostolado e sobre o Cardeal Newman.  
- Sistema de testemunhos e links úteis.  

### Área do Colaborador
- Painel administrativo onde colaboradores podem enviar conteúdo (artigos, livros) para aprovação.  

---

## 🚀 Tecnologias Utilizadas

Este projeto é um **monorepo** que contém o **backend** e o **frontend**.

### Backend (CMS - Strapi)
- **Strapi** → Headless CMS de código aberto, usado para gerenciar o conteúdo e a API.  
- **Node.js** → Ambiente de execução para o backend.  
- **SQLite** → Banco de dados padrão para o ambiente de desenvolvimento.  
- **PostgreSQL** → Recomendado e pré-configurado para o ambiente de produção.  

### Frontend (React)
- **React** → Biblioteca para construção da interface de usuário.  
- **TypeScript** → Superset do JavaScript com tipagem estática.  
- **Vite** → Ferramenta de build para o frontend.  
- **Tailwind CSS** → Framework CSS utility-first para estilização.  
- **shadcn/ui** → Coleção de componentes de UI.  
- **React Router** → Gerenciamento de rotas.  
- **Axios** → Cliente HTTP para requisições ao Strapi.  
- **React Query** → Data-fetching, cache e sincronização de estado com o servidor.  

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (>= 18.x recomendado)  
- **NPM** ou **Yarn**  

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/ApostoladoCardealNewman.git
cd ApostoladoCardealNewman
2. Configurar e Rodar o Backend (Strapi)
Instalar dependências:

bash
Copy code
npm install
# ou
yarn
Configurar variáveis de ambiente:

bash
Copy code
cp .env.example .env
Gere uma chave segura para JWT_SECRET. As demais podem ser mantidas como padrão para desenvolvimento com SQLite.

Rodar o servidor:

bash
Copy code
npm run develop
# ou
yarn develop
O backend estará disponível em http://localhost:1337

Crie o primeiro administrador em http://localhost:1337/admin

3. Configurar e Rodar o Frontend (React)
Navegar até a pasta frontend:

bash
Copy code
cd frontend
Instalar dependências:

bash
Copy code
npm install
# ou
yarn
Configurar variáveis de ambiente:

bash
Copy code
cp .env.example .env
Arquivo .env:

ini
Copy code
VITE_API_URL=http://localhost:1337
Rodar o frontend:

bash
Copy code
npm run dev
# ou
yarn dev
O frontend estará disponível em http://localhost:5173

📂 Estrutura do Projeto
csharp
Copy code
.
├── frontend/         # Aplicação React (Frontend)
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Imagens, SVGs e arquivos estáticos
│   │   ├── components/   # Componentes React reutilizáveis
│   │   ├── contexts/     # Contextos React (ex: AuthContext)
│   │   ├── hooks/        # Hooks customizados
│   │   ├── lib/          # Funções utilitárias
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # Requisições API (Axios)
│   │   ├── types/        # Definições de tipos TypeScript
│   │   └── App.tsx       # Configuração principal de rotas
│   └── package.json
│
├── src/              # Aplicação Strapi (Backend)
│   ├── admin/
│   ├── api/          # Content Types (artigos, livros, etc.)
│   ├── components/   # Componentes do Strapi
│   ├── config/       # Configurações (DB, servidor, etc.)
│   └── index.js      # Ponto de entrada Strapi
│
└── package.json      # Dependências do Backend
🤝 Como Contribuir
Faça um fork do repositório.

Crie uma branch para sua funcionalidade:

bash
Copy code
git checkout -b feature/nome-da-funcionalidade
Realize commits seguindo um padrão claro:

bash
Copy code
git commit -m "feat: adiciona nova funcionalidade X"
Envie sua branch:

bash
Copy code
git push origin feature/nome-da-funcionalidade
Abra um Pull Request no repositório original.