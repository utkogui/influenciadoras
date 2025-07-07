#!/bin/bash

echo "🗑️  Removendo arquivos relacionados ao Docker..."

# Remover docker-compose.yml
if [ -f docker-compose.yml ]; then
    rm docker-compose.yml
    echo "✅ docker-compose.yml removido"
else
    echo "ℹ️  docker-compose.yml não encontrado"
fi

# Remover Dockerfiles
dockerfiles=$(find . -name "Dockerfile*" -type f)
if [ -n "$dockerfiles" ]; then
    echo "📁 Dockerfiles encontrados:"
    echo "$dockerfiles"
    echo "Removendo..."
    find . -name "Dockerfile*" -type f -delete
    echo "✅ Dockerfiles removidos"
else
    echo "ℹ️  Nenhum Dockerfile encontrado"
fi

# Remover .dockerignore
if [ -f .dockerignore ]; then
    rm .dockerignore
    echo "✅ .dockerignore removido"
else
    echo "ℹ️  .dockerignore não encontrado"
fi

# Verificar se há volumes Docker para limpar
echo ""
echo "🧹 Para limpar volumes Docker (opcional):"
echo "docker volume prune"
echo "docker system prune -a"

echo ""
echo "🎉 Remoção concluída!"
echo ""
echo "Agora você pode executar o projeto localmente:"
echo "1. ./setup-local.sh (para configuração automática)"
echo "2. npm run dev (para executar o projeto)" 