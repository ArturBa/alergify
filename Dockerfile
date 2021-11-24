# Common build stage
FROM node:14.17.4-alpine3.12 AS build
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install --frozen-lockfile --non-interactive --silent

COPY src /app/src
COPY tsconfig.json /app/tsconfig.json

RUN yarn build

FROM node:14.17.4-alpine3.12 AS run
WORKDIR /app

ENV PM2_PUBLIC_KEY=XXX
ENV PM2_SECRET_KEY=YYY
RUN npm install pm2 -g --non-interactive --silent

COPY --from=build /app/yarn.lock /app/yarn.lock
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY ecosystem.config.js /app/ecosystem.config.js

COPY --from=build /app/dist /app/dist
EXPOSE 3000

ENV NODE_ENV production

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "prod"]
