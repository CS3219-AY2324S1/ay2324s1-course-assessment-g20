# Peerprep Backend
## Development Setup (uncontainerized)
1. Ensure that you have PostgreSQL, MongoDB and node v18 installed.
1. Ensure that you have yarn v1.22.19 installed (e.g. `npm i -g yarn`).
1. Start PostgreSQL and MongoDB on your local machine.
1. `cd` to the [`backend`](./) directory.
1. Run `yarn install`.
1. Copy the [`.env.example`](./.env.example) file as `.env` (e.g. `cp .env.example .env`) and update the variables where necessary (you may find the [Environment Variables setup](#environment-variables-setup) section below useful).
1. Setup and populate the databases via `yarn migrate-and-seed:all`.
1. Open multiple terminals to the [`backend`](./) directory, and run each microservice in 'watch' mode (e.g. `yarn start:dev http-gateway`, `yarn start:dev question`).
   > NOTE: The complete list of microservices are the directory names under the [`backend/apps`](./apps/) directory. All microservices have to be started for the backend to run correctly.

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
### JWT Tokens
- Set `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` to some random secret string
- Set the corresponding expiries to something desired (e.g. `1h` or `30s` or `7d`)
### Google OAuth
- From Google Console, generate a set of OAuth credentials and put it under `OAUTH_GOOGLE_ID` and `OAUTH_GOOGLE_SECRET`
- For local development:
   - Under `Authorized JavaScript origins`, add `http://localhost:4000`
   - Under `Authorized Redirect URIs`, add
      - `http://localhost:4000/v1/auth/google/redirect`