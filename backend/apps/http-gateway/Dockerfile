FROM node:18-slim as base

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/http-gateway
WORKDIR /app/apps/http-gateway
COPY ./apps/http-gateway .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

FROM base as dev
ENV NODE_ENV development
RUN yarn build http-gateway
CMD ["node", "dist/apps/http-gateway/main"]

FROM base as test
ENV NODE_ENV test
RUN yarn build http-gateway
CMD ["node", "dist/apps/http-gateway/main"]
