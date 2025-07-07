#!/bin/bash

echo "🚀 Configurando projeto localmente..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL não está instalado. Por favor, instale o PostgreSQL primeiro."
    echo "📖 Consulte o arquivo database-setup.md para instruções de instalação."
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cat > .env.local << EOF
# Configurações do Banco de Dados
DATABASE_URL=postgres://postgres:postgres@localhost:5432/influenciadoras

# Configurações do Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Configurações do Ambiente
NODE_ENV=development
PORT=3000
EOF
    echo "✅ Arquivo .env.local criado!"
else
    echo "ℹ️  Arquivo .env.local já existe."
fi

# Verificar se o banco de dados existe
echo "🔍 Verificando banco de dados..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw influenciadoras; then
    echo "✅ Banco de dados 'influenciadoras' já existe!"
else
    echo "📊 Criando banco de dados 'influenciadoras'..."
    psql -U postgres -c "CREATE DATABASE influenciadoras;"
    echo "✅ Banco de dados criado com sucesso!"
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Para iniciar o projeto, execute:"
echo "  npm run dev"
echo ""
echo "O projeto estará disponível em: http://localhost:3000" 