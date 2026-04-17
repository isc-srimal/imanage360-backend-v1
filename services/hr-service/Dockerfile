# services/hr-service/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm ci --omit=dev

EXPOSE 4002

CMD ["node", "src/index.js"]