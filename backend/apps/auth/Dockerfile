FROM node:18-slim

RUN mkdir -p /app/libs
WORKDIR /app/libs
COPY ./libs .

RUN mkdir -p /app/apps/auth
WORKDIR /app/apps/auth
COPY ./apps/auth .

# package.json, nest-cli.json, tsconfig.build.json, tsconfig.json
WORKDIR /app
COPY *.json \
     yarn.lock \
     ./
     
RUN yarn install --frozen-lockfile
RUN yarn build auth

CMD ["node", "dist/apps/auth/main"]
