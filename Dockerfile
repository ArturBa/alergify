# Common build stage
FROM node:14.17.4-alpine3.12

COPY package.json /app
COPY yarn.lock /app

WORKDIR /app

RUN yarn install --frozen-lockfile

COPY dist /dist

EXPOSE 3000

ENV NODE_ENV production

CMD ["yarn", "pm2 start ecosystem.config.js --only prod"]
