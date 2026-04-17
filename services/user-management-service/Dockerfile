FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm ci --omit=dev

EXPOSE 4001

CMD ["node", "src/index.js"]