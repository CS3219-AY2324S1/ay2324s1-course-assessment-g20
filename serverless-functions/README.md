## Local Development Setup
PeerPrep uses Google Cloud Functions for deployment of serverless functions. The Functions Framework is used for local development and testing of these functions. The function pulls question titles, descriptions, categories, and difficulties from LeetCode.
1. `cd` to the `serverless-functions` directory.
1. Run `yarn install`.
1. Run `yarn start` to run the function with the Functions Framework.
1. Visit http://localhost:8000 to access the function.
  - To specify a number of questions to pull from LeetCode, use the query parameter `numQuestions` (e.g. to pull 100 questions, do http://localhost:8000?numQuestions=100)
