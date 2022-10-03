FROM node:11.13.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk update && apk upgrade

COPY . /usr/src/app/
RUN npm i
RUN npm run build

CMD [ "npm", "start:prod" ]