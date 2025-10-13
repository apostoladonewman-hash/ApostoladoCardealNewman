# Estágio de Build - Use Node.js v20, que é a versão LTS mais recente e compatível
FROM node:20-alpine AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependências
COPY package.json ./
COPY package-lock.json ./

# Instalar dependências (usando --omit=dev, o novo padrão)
RUN npm ci --omit=dev

# Copiar o restante dos arquivos da aplicação
COPY . .

# Construir a aplicação Strapi
RUN npm run build

# Estágio de Produção - Use a mesma versão do Node.js
FROM node:20-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar as dependências instaladas do estágio de build
COPY --from=build /app/node_modules ./node_modules

# Copiar a aplicação construída do estágio de build
COPY --from=build /app ./

# Copiar o script de entrypoint e dar permissão de execução
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expor a porta que o Strapi usa
EXPOSE 1337

# Definir o entrypoint que rodará as migrações antes de iniciar
ENTRYPOINT ["docker-entrypoint.sh"]

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]