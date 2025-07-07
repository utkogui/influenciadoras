# Configuração para Produção

## 1. Variáveis de Ambiente

Crie um arquivo `.env.production` com as seguintes variáveis:

```env
# Banco de Dados (PostgreSQL)
DATABASE_URL=postgres://username:password@host:port/database

# Configurações do Next.js
NEXT_PUBLIC_API_URL=https://seu-dominio.com/api
NODE_ENV=production
PORT=3000

# Configurações de Segurança
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://seu-dominio.com
```

## 2. Banco de Dados em Produção

### Opção A: PostgreSQL Gerenciado (Recomendado)
- **Vercel Postgres**
- **Supabase**
- **Neon**
- **Railway**

### Opção B: PostgreSQL Self-hosted
- Configure um servidor PostgreSQL
- Execute o script `database-migration.sql`

## 3. Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Outras Plataformas
- **Netlify**: Configure build command: `npm run build`
- **Railway**: Conecte o repositório
- **Render**: Configure como aplicação Node.js

## 4. Build e Teste Local

```bash
# Build de produção
npm run build

# Teste local do build
npm start
```

## 5. Checklist de Produção

- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] Build testado localmente
- [ ] Deploy realizado
- [ ] Funcionalidades testadas em produção 