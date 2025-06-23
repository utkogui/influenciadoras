# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.20.2
FROM node:20-slim

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Build do projeto (Next.js)
RUN npx next build

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
