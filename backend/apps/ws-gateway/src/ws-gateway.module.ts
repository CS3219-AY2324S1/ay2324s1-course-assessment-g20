import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/config';
import wsGatewayConfiguration from './config/configuration';
import { YjsGateway } from './websocket-gateways/yjs.gateway';
import { MatchingGateway } from './websocket-gateways/matching.gateway';
import { MatchingWebsocketService } from './services/matchingWebsocketService';
import { registerGrpcClients } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';
import { MatchingWebsocketController } from './controller/matchingWebsocket.controller';

@Module({
  imports: [
    ConfigModule.loadConfiguration(wsGatewayConfiguration),
    registerGrpcClients([
      Service.COLLABORATION_SERVICE,
      Service.USER_SERVICE,
      Service.MATCHING_SERVICE,
      Service.QUESTION_SERVICE, // for ws testing setup
    ]),
  ],
  controllers: [MatchingWebsocketController],
  providers: [YjsGateway, MatchingGateway, MatchingWebsocketService],
})
export class WsGatewayModule {}
