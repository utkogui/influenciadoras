# Plataforma de Gerenciamento de Influenciadoras

Sistema para gerenciamento de influenciadoras digitais, com funcionalidades de cadastro, busca e integração com Instagram.

## Tecnologias Utilizadas

- Frontend:
  - Next.js 14 (App Router)
  - TypeScript
  - Chakra UI
  - Axios
  - Zod (validação)

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - TypeScript
  - Docker

## Funcionalidades

- Cadastro de influenciadoras
- Scraping automático de dados do Instagram
- Visualização de métricas (seguidores)
- Sistema de tags para categorização
- Interface responsiva e moderna

## Como Executar

### Opção 1: Execução Local (Recomendado)

#### Pré-requisitos

- Node.js 18+
- PostgreSQL instalado localmente

#### Configuração

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd plataforma-influenciadoras
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o PostgreSQL:
   - Instale o PostgreSQL seguindo as instruções em `database-setup.md`
   - Crie o banco de dados: `CREATE DATABASE influenciadoras;`

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto com:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/influenciadoras
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
PORT=3000
```

#### Executando

1. Inicie o projeto em modo desenvolvimento:
```bash
npm run dev
```

2. Acesse http://localhost:3000 no navegador

### Opção 2: Execução com Docker (Legado)

#### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

#### Executando

1. Inicie os containers Docker:
```bash
docker-compose up -d
```

2. Inicie o frontend em modo desenvolvimento:
```bash
npm run dev
```

3. Acesse http://localhost:3000 no navegador

## Estrutura do Projeto

```
plataforma-influenciadoras/
├── backend/              # API Node.js
│   ├── src/
│   │   ├── db.ts        # Configuração do banco
│   │   ├── index.ts     # Servidor Express
│   │   └── scraper.ts   # Scraping do Instagram
│   └── ...
├── src/                 # Frontend Next.js
│   ├── app/
│   │   ├── cadastro/    # Página de cadastro
│   │   └── ...
│   └── ...
└── ...
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
