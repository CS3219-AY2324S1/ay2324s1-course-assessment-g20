FROM node:18-slim

RUN mkdir -p /app/frontend
WORKDIR /app/frontend
COPY ./ ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --frozen-lockfile

RUN yarn build
CMD ["yarn", "preview", "--host"]
