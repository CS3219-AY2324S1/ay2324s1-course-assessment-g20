# Local Development Setup
1. Ensure that you have node v18 installed.
1. Ensure that you have yarn v1.22.19 installed (e.g. `npm i -g yarn`).
1. Run `yarn install`.
1. Run `yarn dev` to start the frontend in development mode.

# Local Production mode
1. Run `yarn build`.
1. Run `yarn preview`.

# Building locally with Docker
1. Install Docker Desktop if you have not already done so.
1. Create a `.env.production.local` file, and copy the contents from `.env.development` (e.g. `cp .env.development .env.production.local`).
1. In the [`frontend`](./) directory, run `yarn start:docker` to build and run the containerized frontend.
1. Run `yarn stop:docker` to stop the container.
