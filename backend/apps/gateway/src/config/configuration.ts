import { TcpOptions, Transport } from '@nestjs/microservices';

const gatewayConfiguration = () => {
  const questionServiceOptions: TcpOptions = {
    options: {
      port: parseInt(process.env.QUESTION_SERVICE_PORT, 10),
      host: process.env.QUESTION_SERVICE_HOST,
    },
    transport: Transport.TCP,
  };

  const authServiceOptions: TcpOptions = {
    options: {
      port: parseInt(process.env.AUTH_SERVICE_PORT, 10),
      host: process.env.AUTH_SERVICE_HOST,
    },
    transport: Transport.TCP,
  };

  return {
    port: parseInt(process.env.API_GATEWAY_PORT, 10),
    corsOrigin: process.env.CORS_ORIGIN,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    questionServiceOptions,
    authServiceOptions,
  };
};

export default gatewayConfiguration;
