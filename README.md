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

## Como Executar em Produção (Render + Supabase)

### Pré-requisitos
- Conta no Render
- Conta no Supabase

### Configuração
1. Configure a variável de ambiente `DATABASE_URL` no Render:
   ```
   postgresql://postgres:Matilha0108!@#@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
2. Execute o script SQL do projeto no Supabase para criar a tabela.
3. Faça o deploy normalmente.

### Observação
Não use mais localhost. Toda a conexão é feita via Supabase.

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
