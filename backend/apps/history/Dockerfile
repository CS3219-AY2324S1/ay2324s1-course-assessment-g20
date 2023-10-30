FROM node:18-slim

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/history
WORKDIR /app/apps/history
COPY ./apps/history .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./
     
RUN yarn install --frozen-lockfile
RUN yarn build history

CMD ["node", "dist/apps/history/main"]
