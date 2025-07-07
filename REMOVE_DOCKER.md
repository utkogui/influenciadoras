# Removendo Docker do Projeto

Este documento contém instruções para remover completamente o Docker do projeto e executá-lo localmente.

## Arquivos que podem ser removidos

### 1. docker-compose.yml
Este arquivo não é mais necessário se você não quiser usar Docker.

```bash
rm docker-compose.yml
```

### 2. Dockerfiles (se existirem)
Se houver arquivos Dockerfile no projeto, eles também podem ser removidos:

```bash
# Verificar se existem Dockerfiles
find . -name "Dockerfile*" -type f

# Remover se existirem
find . -name "Dockerfile*" -type f -delete
```

### 3. .dockerignore
Se existir um arquivo .dockerignore, também pode ser removido:

```bash
rm .dockerignore
```

## Configuração Local

### 1. Instalar PostgreSQL localmente

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Configurar o banco de dados

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco de dados
CREATE DATABASE influenciadoras;

# Sair do psql
\q
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/influenciadoras
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
PORT=3000
```

### 4. Instalar dependências e executar

```bash
npm install
npm run dev
```

## Vantagens da execução local

1. **Performance**: Execução mais rápida sem overhead do Docker
2. **Simplicidade**: Menos camadas de abstração
3. **Debugging**: Mais fácil de debugar
4. **Recursos**: Menor uso de recursos do sistema
5. **Desenvolvimento**: Mais próximo do ambiente de produção

## Script de configuração automática

Use o script `setup-local.sh` para configurar automaticamente:

```bash
./setup-local.sh
```

Este script irá:
- Verificar se Node.js e PostgreSQL estão instalados
- Instalar dependências
- Criar arquivo .env.local
- Criar banco de dados se necessário
- Fornecer instruções para executar o projeto 