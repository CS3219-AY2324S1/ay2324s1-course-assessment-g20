const questionConfiguration = () => {
  return {
    port: parseInt(process.env.QUESTION_SERVICE_PORT, 10),
    mongoUri: process.env.QUESTION_SERVICE_MONGODB_URL,
  };
};

export default questionConfiguration;
