FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add --no-cache git
RUN apk update && apk upgrade
RUN npm install pm2 -g

COPY . .
RUN npm i
RUN npm run build


CMD [ "npm", "run", "pm2" ]