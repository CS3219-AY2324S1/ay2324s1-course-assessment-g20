import { TcpOptions, Transport } from '@nestjs/microservices';

const gatewayConfiguration = () => ({
  port: parseInt(process.env.API_GATEWAY_PORT, 10),
  questionService: {
    options: {
      port: parseInt(process.env.QUESTION_SERVICE_PORT, 10),
      host: process.env.QUESTION_SERVICE_HOST,
    },
    transport: Transport.TCP,
  } as TcpOptions,
});

export default gatewayConfiguration;
