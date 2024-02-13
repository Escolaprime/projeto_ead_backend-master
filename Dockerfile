FROM node:16.16

RUN apt update && apt install -y --no-install-recommends \
  git \
  ca-certificates


WORKDIR /home/node/app

COPY package*.json ./
COPY . .

EXPOSE 3003

RUN yarn 
RUN yarn build

CMD [ "sh", "-c", "yarn start" ]