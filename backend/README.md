## Development Setup
1. Ensure that you have PostgreSQL, MongoDB, Redis and node v18 installed.
1. Start PostgreSQL, MongoDB and Redis (e.g. `brew services start redis` if installed via Homebrew on MacOS)
1. `cd` to the `backend` directory.
1. Run `yarn install`.
1. Copy the `.env.example` file as `.env` (e.g. `cp .env.example .env`) and update the variables where necessary.
1. Setup and populate the databases via `yarn migrate-and-seed:all`.
1. Open multiple terminals to the `backend` directory, and run each microservice in 'watch' mode (e.g. `yarn start:dev gateway`, `yarn start:dev question`).

## Building locally
1. Install Docker Desktop if you have not already done so.
1. Populate the empty fields in the `.env.docker` file.
1. In the `backend` directory, run `yarn start:docker` to build and run all Dockerized microservices in detached mode locally.
1. Run `yarn stop:docker` to stop the microservice containers.

## Testing (CI pipeline with Docker)
1. Install Docker Desktop if you have not already done so.
1. In the `backend` directory, run `yarn test:ci` to run the E2E tests.

## Database migrations
1. Create a knex (SQL) database migration file via `yarn migrate:make {microservice_name} {migration_file_name}`.
1. To rollback a knex migration, run `yarn knex {microservice_name} migrate:rollback`.

## Making Commits
1. Run `yarn lint` and `yarn format` in the `backend` directory to lint and format the backend codebase.

## Chatbot microservice
- Populate CHATBOT_SERVICE_OPENAI_API_KEY={Your own API key from open AI}