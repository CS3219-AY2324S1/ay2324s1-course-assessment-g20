import OpenAI from 'openai';

const chatbotConfiguration = () => {
  const openai = new OpenAI({
    apiKey: process.env.CHATBOT_SERVICE_OPENAI_API_KEY,
  });

  return {
    port: parseInt(process.env.CHATBOT_SERVICE_PORT, 10),
    mongoUri: process.env.CHATBOT_SERVICE_MONGODB_URL,
    openai,
  };
};

export default chatbotConfiguration;
