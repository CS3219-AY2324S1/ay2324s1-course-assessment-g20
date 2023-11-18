FROM node:18-slim

RUN mkdir -p /app/scripts
WORKDIR /app/scripts
COPY ./scripts /app/scripts

RUN mkdir -p /app/data
WORKDIR /app/data
COPY ./data /app/data

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps
WORKDIR /app/apps
COPY ./apps /app/apps

WORKDIR /app
COPY package.json yarn.lock tsconfig*.json ./

# Cache yarn dependencies
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

CMD ["yarn", "migrate-and-seed:all"]
