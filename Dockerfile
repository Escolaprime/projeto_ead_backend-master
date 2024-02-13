FROM node:16.12-slim

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build 

RUN export NODE_ENV=production
EXPOSE 3003

CMD [ "npm", "run", "start" ]