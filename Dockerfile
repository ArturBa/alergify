# Common build stage
FROM node:14.17.4-alpine3.12

COPY . ./app

WORKDIR /app

RUN yarn install --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV production

CMD ["yarn", "start"]
