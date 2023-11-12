FROM node:18-slim as base

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/ws-gateway
WORKDIR /app/apps/ws-gateway
COPY ./apps/ws-gateway .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./

# Cache yarn dependencies
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

FROM base as dev
ENV NODE_ENV development
RUN yarn build ws-gateway
CMD ["node", "dist/apps/ws-gateway/main"]

FROM base as test
ENV NODE_ENV test
RUN yarn build ws-gateway
CMD ["node", "dist/apps/ws-gateway/main"]
