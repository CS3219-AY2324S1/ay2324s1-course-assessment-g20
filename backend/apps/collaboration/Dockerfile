FROM node:18-slim

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/collaboration
WORKDIR /app/apps/collaboration
COPY ./apps/collaboration .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./
     
RUN yarn install --frozen-lockfile
RUN yarn build collaboration

CMD ["node", "dist/apps/collaboration/main"]
