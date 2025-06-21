# Usamos a imagem Node completa que já inclui ferramentas de build
FROM node:18

# Instala o Chromium e dependências para o Puppeteer
RUN apt-get update && apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Aponta o Puppeteer para o executável do Chromium que ele baixa
ENV PUPPETEER_EXECUTABLE_PATH=""

# Cria e usa um usuário não-root
RUN adduser --disabled-password --gecos '' pptruser
USER pptruser

EXPOSE 3001

# Roda a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"] 