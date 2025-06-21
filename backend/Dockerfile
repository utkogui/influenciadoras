# Use a imagem oficial do Puppeteer que já vem com Chrome
FROM ghcr.io/puppeteer/puppeteer:21.7.0

# Define variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

EXPOSE 3001

# Roda a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"] 