## Development Setup
1. `cd` to the `backend` directory.
1. Run `yarn install`.
1. Copy the `.env.example` file as `.env` (e.g. `cp .env.example .env`) and update the variables where necessary.
1. Setup the databases via `yarn migrate:all`.
1. Open multiple terminals to the `backend` directory, and run each microservice in 'watch' mode (e.g. `yarn start:dev gateway`, `yarn start:dev question`).

## Using Docker
TODO

## Testing (local)
1. Start all the microservices except `gateway` (it is optional to start the `gateway` service).
1. In the `backend` directory, run `yarn test` to run the E2E tests.

## Database migrations
1. Create a knex (SQL) database migration file via `yarn migrate:make {microservice_name} {migration_file_name}`.
1. To rollback a knex migration, run `yarn knex {microservice_name} migrate:rollback`.


## Making Commits
1. Run `yarn lint` and `yarn format` in the `backend` directory to lint and format the backend codebase.
