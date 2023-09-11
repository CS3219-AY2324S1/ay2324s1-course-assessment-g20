FROM node:18-slim

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/question
WORKDIR /app/apps/question
COPY ./apps/question .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./
     
RUN yarn install --frozen-lockfile
RUN yarn build question

CMD ["node", "dist/apps/question/main"]
