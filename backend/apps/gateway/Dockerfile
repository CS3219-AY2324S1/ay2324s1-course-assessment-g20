FROM node:18-slim as base

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/gateway
WORKDIR /app/apps/gateway
COPY ./apps/gateway .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./
     
RUN yarn install --frozen-lockfile

FROM base as dev
ENV NODE_ENV development
RUN yarn build gateway
CMD ["node", "dist/apps/gateway/main"]

FROM base as test
ENV NODE_ENV test
RUN yarn build gateway
CMD ["node", "dist/apps/gateway/main"]
