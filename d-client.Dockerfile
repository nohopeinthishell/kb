ARG NODE_VERSION=24
ARG CLIENT_PORT=3000

FROM node:$NODE_VERSION-bookworm AS base

WORKDIR /app

FROM base AS builder

COPY package.json yarn.lock ./
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build --scope=client

FROM node:$NODE_VERSION-bookworm-slim AS production
ARG CLIENT_PORT
WORKDIR /app

COPY --from=builder /app/packages/client/dist/ /app/dist/
COPY --from=builder /app/packages/client/server/ /app/server/
COPY --from=builder /app/packages/client/package.json /app/package.json
RUN yarn install --production=true

EXPOSE $CLIENT_PORT
CMD [ "node", "/app/server/index.js" ]
