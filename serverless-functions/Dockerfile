FROM node:18-slim

RUN mkdir -p /app/serverless-functions
WORKDIR /app/serverless-functions
COPY ./ ./

RUN yarn install --frozen-lockfile

RUN yarn build
CMD ["yarn", "start"]
