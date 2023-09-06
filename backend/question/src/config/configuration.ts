const questionConfiguration = () => ({
  port: parseInt(process.env.QUESTION_SERVICE_PORT, 10),
});

export default questionConfiguration;
