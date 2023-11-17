## Local Development Setup
PeerPrep uses Google Cloud Functions for deployment of serverless functions. The Functions Framework is used for local development and testing of these functions. The function pulls question titles, descriptions, categories, and difficulties from LeetCode.
1. Ensure that you have node v18 installed.
1. `cd` to the `serverless-functions` directory.
1. Run `yarn install`.
1. Run `yarn build`.
1. Run `yarn start` to run the function with the Functions Framework.
1. Visit http://localhost:8000 to trigger the function.
  - To specify a number of questions to pull from LeetCode, use the query parameter `numQuestions` (e.g. to pull 100 questions, do http://localhost:8000?numQuestions=100)

# Building locally with Docker
1. Install Docker Desktop if you have not already done so.
> NOTE: Ensure that the backend containers are running (i.e. `cd backend` followed by `yarn start:docker`)
1. In the [`serverless-functions`](./) directory, run `yarn start:docker` to build and run the containerized serverless function.
1. Visit http://localhost:8000 to trigger the function as explained above.
1. Run `yarn stop:docker` to stop the container.