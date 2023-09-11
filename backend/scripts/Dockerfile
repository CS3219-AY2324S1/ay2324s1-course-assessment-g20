FROM node:18-slim

RUN mkdir -p /app/scripts
WORKDIR /app/scripts
COPY ./scripts /app/scripts

RUN mkdir -p /app/apps
WORKDIR /app/apps
COPY ./apps /app/apps

WORKDIR /app
COPY package.json yarn.lock tsconfig*.json ./
     
RUN yarn install --frozen-lockfile

CMD ["yarn", "migrate:all"]
