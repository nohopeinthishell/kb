ARG NODE_VERSION=24
ARG SERVER_PORT=3001

FROM node:$NODE_VERSION-bookworm AS base

WORKDIR /app

FROM base AS builder

COPY package.json yarn.lock ./
COPY packages/server/package.json packages/server/
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build --scope=server

FROM node:$NODE_VERSION-bookworm-slim AS production
ARG SERVER_PORT
WORKDIR /app

COPY --from=builder /app/package.json package.json
COPY --from=builder /app/yarn.lock yarn.lock

COPY --from=builder /app/packages/server/package.json packages/server/package.json
RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/packages/server/dist/ packages/server/dist/

EXPOSE $SERVER_PORT
CMD [ "node", "/app/packages/server/dist/index.js" ]
