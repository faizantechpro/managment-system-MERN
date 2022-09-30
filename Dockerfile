ARG NODE_VERSION=16-alpine
FROM node:${NODE_VERSION}

WORKDIR /idf

COPY package*.json ./
COPY api/package.json api/
COPY .env.example .env

COPY . .


RUN npm install
RUN npm run build

WORKDIR /idf/api
RUN npm install
RUN npm run build

CMD ["node", "./dist/start.js"]
EXPOSE 8080/tcp