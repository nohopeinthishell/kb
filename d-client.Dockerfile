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

COPY --from=builder /app/package.json package.json
COPY --from=builder /app/yarn.lock yarn.lock

COPY --from=builder /app/packages/client/package.json packages/client/package.json
RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/packages/client/dist/ packages/client/dist/
COPY --from=builder /app/packages/client/server/ packages/client/server/

EXPOSE $CLIENT_PORT
CMD [ "node", "/app/packages/client/server/index.js" ]
