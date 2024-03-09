FROM node:16.16

RUN apt update && apt install -y --no-install-recommends \
  git \
  ca-certificates 

WORKDIR /home/node/app

COPY package*.json ./
COPY . .

RUN npm install pm2 -g

EXPOSE 3003

RUN yarn 
RUN yarn build

CMD [ "sh", "-c", "yarn start" ]