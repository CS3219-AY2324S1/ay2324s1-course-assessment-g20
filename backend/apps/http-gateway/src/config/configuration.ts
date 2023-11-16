const httpGatewayConfiguration = () => {
  return {
    port: parseInt(process.env.HTTP_GATEWAY_PORT, 10),
    corsOrigin: process.env.CORS_ORIGIN,
  };
};

export default httpGatewayConfiguration;
