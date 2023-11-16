# Peerprep Backend
## Development Setup (uncontainerized)
1. Ensure that you have MongoDB and node v18 installed.
1. Ensure that you have yarn v1.22.19 installed (e.g. `npm i -g yarn`).
1. Start MongoDB on your local machine.
1. `cd` to the [`backend`](./) directory.
1. Run `yarn install`.
1. Copy the [`.env.example`](./.env.example) file as `.env`.
1. Setup and populate the databases via `yarn migrate-and-seed:all`.
1. Open multiple terminals to the [`backend`](./) directory, and run each microservice in 'watch' mode (e.g. `yarn start:dev http-gateway`, `yarn start:dev question`).
   > NOTE: The complete list of microservices are the directory names under the [`backend/apps`](./apps/) directory. All microservices have to be started for the backend to run correctly.

## Making Commits
1. Run `yarn lint` and `yarn format` in the [`backend`](./) directory to lint and format the backend codebase.
