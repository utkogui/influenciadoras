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

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (ou usar via Docker)

### Configuração

1. Clone o repositório:
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd plataforma-influenciadoras
```

2. Instale as dependências do frontend:
```bash
npm install
```

3. Instale as dependências do backend:
```bash
cd backend
npm install
cd ..
```

4. Configure as variáveis de ambiente:
- Crie um arquivo `.env` na raiz do projeto com:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/influencers
```

### Executando

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
