# Étape 1 : Build de l'application TypeScript
FROM node:18.16.0

WORKDIR /app

COPY package*.json ./

COPY ./node_modules /app/

COPY . .

RUN npm run build
COPY --chown=root ./build ./

EXPOSE 3001

CMD ["node", "./build/src/server.js"]