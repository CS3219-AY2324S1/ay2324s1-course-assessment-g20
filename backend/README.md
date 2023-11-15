# Peerprep Backend
## Development Setup (uncontainerized)
1. Ensure that you have PostgreSQL, MongoDB, Redis and node v18 installed.
1. Ensure that you have yarn v1.22.19 installed (e.g. `npm i -g yarn`).
1. Start PostgreSQL, MongoDB and Redis (e.g. `brew services start redis` if installed via Homebrew on MacOS)
1. `cd` to the [`backend`](./) directory.
1. Run `yarn install`.
1. Copy the [`.env.example`](./.env.example) file as `.env` (e.g. `cp .env.example .env`) and update the variables where necessary (you may find the [Environment Variables setup](#environment-variables-setup) section below useful).
1. Setup and populate the databases via `yarn migrate-and-seed:all`.
1. Open multiple terminals to the [`backend`](./) directory, and run each microservice in 'watch' mode (e.g. `yarn start:dev http-gateway`, `yarn start:dev ws-gateway`, `yarn start:dev question`).
   > NOTE: The complete list of microservices are the directory names under the [`backend/apps`](./apps/) directory. All microservices have to be started for the backend to run correctly.

## Building locally with Docker
> The teaching team can choose to setup the dockerized backend locally as follows:
1. Install Docker Desktop if you have not already done so.
1. Copy the [`.env.docker.example`](./.env.docker.example) file as `.env.docker` (e.g. `cp .env.docker.example .env.docker`) and update the ***remaining*** empty secrets (you may find the [Environment Variables setup](#environment-variables-setup) section below useful).
1. In the [`backend`](./) directory, run `yarn start:docker` to build and run all Dockerized microservices in detached mode locally.
1. Run `yarn stop:docker` to stop the microservice containers.

## Testing (local)
1. Install Docker Desktop if you have not already done so.
1. In the [`backend`](./) directory, run `yarn test` to run the E2E tests

## Database migrations
1. Create a knex (SQL) database migration file via `yarn migrate:sql:make {microservice_name} {migration_file_name}`.
1. To rollback a knex migration, run `yarn knex {microservice_name} migrate:rollback`.

## Making Commits
1. Run `yarn lint` and `yarn format` in the [`backend`](./) directory to lint and format the backend codebase.

## Upgrading of user to maintainer role
1. To test out CRUD operations with questions, update the role_id column of the you want entry in the user_profiles table in the peer-prep-user-service database. (e.g. `UPDATE user_profiles SET role_id=1 WHERE name='Your Name'`)

## Environment Variables setup
### PostgreSQL Variables
- For local PostgreSQL, `{MICROSERVICE}_SERVICE_SQL_DATABASE_HOST` can be left blank
- Update the USER and PASSWORD related variables
### Chatbot API
- Populate CHATBOT_SERVICE_OPENAI_API_KEY={Your own API key from open AI}
### JWT Tokens
- Set `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` to some random secret string
- Set the corresponding expiries to something desired (e.g. `1h` or `30s` or `7d`)
### Google OAuth
- From Google Console, generate a set of OAuth credentials and put it under `OAUTH_GOOGLE_ID` and `OAUTH_GOOGLE_SECRET`
- For local development:
   - Under `Authorized JavaScript origins`, add `http://localhost:4000`
   - Under `Authorized Redirect URIs`, add
      - `http://localhost:4000/v1/auth/google/redirect` (if running via Docker as per the section [Building locally with Docker](#building-locally-with-docker) above)
      - `http://localhost/v1/auth/google/redirect` (if running via Kubernetes and minikube as per the instructions [here](./deployment/README.md))
      - OR simply add both
- For production deployment:
   - Replace `Authorized JavaScript origins` with the production frontend URL
   - Replace `Authorized Redirect URIs` with the production backend domain with the same endpoints above

## Deployment
- Detailed deployment instructions can be found in the deployment README [here](./deployment/README.md).
- A detailed deployment architecture diagram can be found [here](./deployment/README.md#deployment-architecture-diagram).