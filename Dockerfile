FROM node:18

ENV PORT 3000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm i yarn
COPY package*.json /usr/src/app/
RUN yarn install
COPY . /usr/src/app

RUN yarn build
EXPOSE 3000



CMD "yarn" "serve"
