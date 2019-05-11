FROM node:10.15.3-alpine

WORKDIR /usr/src/app

COPY routers routers
COPY helpers helpers
COPY package.json package.json
COPY index.js .
COPY yarn.lock yarn.lock
COPY VERSION .

RUN yarn install --production

EXPOSE 3000
CMD [ "npm", "start"]