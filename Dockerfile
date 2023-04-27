FROM node:latest

COPY package.json ./

COPY yarn.lock ./

RUN npm install -g yarn

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000