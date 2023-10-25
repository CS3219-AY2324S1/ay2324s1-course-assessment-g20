import { OpenAiConfig } from '@app/types/openAi';

const chatbotConfiguration = () => {
  const openAiConfig: OpenAiConfig = {
    apiKey: process.env.CHATBOT_SERVICE_OPENAI_API_KEY,
  };

  return {
    port: parseInt(process.env.CHATBOT_SERVICE_PORT, 10),
    mongoUri: process.env.CHATBOT_SERVICE_MONGODB_URL,
    openAiConfig,
  };
};

export default chatbotConfiguration;
