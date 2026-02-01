# 🏛️ Imperial Codex

O **Imperial Codex** é uma plataforma web completa para gerenciamento de conteúdo literário, desenvolvida como um blog/wiki pessoal com tema "Neon Imperial Brutalism".

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## ✨ Features

### 📚 Sistema de Histórias
- Histórias organizadas por categorias (Sonhos, Contos, Crônicas, Ideias, Pensamentos)
- Sistema de capítulos ordenados
- Status de publicação (Rascunho, Publicado, Arquivado)
- Histórias em destaque
- Contador de visualizações

### 📖 Wiki Codex
- Entidades tipadas (Personagens, Locais, Eventos, Fatos, Itens, Conceitos, Organizações)
- Sistema de relações entre entidades
- Conexão entre entidades e histórias
- Coordenadas 3D para futura integração com mapas
- Campo de propriedades JSON flexível

### 🎨 Design
- Tema "Neon Imperial Brutalism" — preto absoluto com acentos crimson/gold
- Efeitos de glow neon
- Animações suaves com Framer Motion
- Scrollbar customizada
- Totalmente responsivo
- Dark mode nativo

### 🔐 Admin Dashboard
- Autenticação com Supabase Auth
- CRUD completo para histórias e capítulos
- CRUD completo para entidades wiki
- Gerenciamento de mídia (preparado para Storage)
- Dashboard com estatísticas

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State**: TanStack Query (React Query)
- **Forms**: React Hook Form (quando necessário)

## 🚀 Getting Started

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/blog-baltazar.git
cd blog-baltazar
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

4. Preencha as variáveis no `.env.local` com suas credenciais do Supabase.

5. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Dashboard administrativo
│   ├── login/             # Página de login
│   ├── stories/           # Listagem e leitura de histórias
│   ├── wiki/              # Codex Wiki
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Header, Footer
│   ├── stories/           # Componentes de histórias
│   ├── wiki/              # Componentes de wiki
│   ├── ui/                # shadcn/ui components
│   └── providers.tsx      # React Query + Toaster
├── hooks/                 # Custom hooks (TanStack Query)
├── lib/
│   ├── queries/           # Funções de query Supabase
│   ├── supabase/          # Clients Supabase
│   └── utils.ts           # Utilidades
├── types/
│   └── database.types.ts  # Tipos gerados do Supabase
└── middleware.ts          # Auth middleware
```

## 🗄️ Database Schema

### Tables

- **profiles** — Perfis de usuário (sync com auth.users)
- **stories** — Histórias com metadados
- **chapters** — Capítulos de histórias
- **wiki_entities** — Entidades do wiki
- **entity_relations** — Relações entre entidades
- **entity_story_relations** — Conexões entidade ↔ história
- **media** — Arquivos de mídia

### Enums

- `story_category`: dream, idea, thought, tale, chronicle, other
- `story_status`: draft, published, archived
- `wiki_entity_type`: character, location, fact, event, item, concept, organization

## 🎯 Roadmap

- [ ] Upload de imagens para Storage
- [ ] Editor WYSIWYG para capítulos
- [ ] Mapa 3D interativo com entidades
- [ ] Sistema de busca avançada
- [ ] Markdown/MDX para conteúdo
- [ ] PWA support
- [ ] Internacionalização (i18n)

## 📄 License

MIT License

---

Criado com ❤️ por **Marcus**
