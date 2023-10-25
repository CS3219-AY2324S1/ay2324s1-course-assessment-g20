import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import matchingConfiguration from './config/configuration';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { RedisStoreService } from '../store/redisStore.service';

@Module({
  imports: [
    ConfigModule.loadConfiguration(matchingConfiguration),
    registerGrpcClients([
      Service.QUESTION_SERVICE,
      Service.COLLABORATION_SERVICE,
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        await configService.get('getMatchingStoreConfigurationOptions')(),
      inject: [ConfigService],
    }),
  ],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    RedisStoreService,
    {
      provide: Service.WEBSOCKET_GATEWAY,
      useFactory: async (configService: ConfigService) =>
        ClientProxyFactory.create(configService.get('websocketGatewayOptions')),
      inject: [ConfigService],
    },
  ],
})
export class MatchingModule {}