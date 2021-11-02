FROM node:alpine

WORKDIR /app

COPY package.json /app

RUN npm install

RUN chown -R node.node /app

COPY . /app

CMD ["npm", "run", "start"]