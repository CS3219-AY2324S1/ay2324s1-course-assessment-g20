FROM node:18-slim

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/matching
WORKDIR /app/apps/matching
COPY ./apps/matching .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./
     
RUN yarn install --frozen-lockfile
RUN yarn build matching

CMD ["node", "dist/apps/matching/main"]
