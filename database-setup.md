# Configuração do Banco de Dados Local

## 1. Instalar PostgreSQL

### macOS (usando Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows:
Baixe e instale o PostgreSQL do site oficial: https://www.postgresql.org/download/windows/

## 2. Criar o Banco de Dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco de dados
CREATE DATABASE influenciadoras;

# Sair do psql
\q
```

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/influenciadoras
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
PORT=3000
```

## 4. Instalar Dependências

```bash
npm install
```

## 5. Executar o Projeto

```bash
npm run dev
```

O projeto estará disponível em: http://localhost:3000 