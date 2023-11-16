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

## Environment Variables setup
### PostgreSQL Variables
- For local PostgreSQL, `{MICROSERVICE}_SERVICE_SQL_DATABASE_HOST` can be left blank
- Update the USER and PASSWORD related variables
