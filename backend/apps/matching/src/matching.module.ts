import { ConfigModule } from '@app/config';
import { Service } from '@app/microservice/services';
import { registerGrpcClients } from '@app/microservice/utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { redisStore } from 'cache-manager-redis-yet';
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
      useFactory: async () => ({
        store: await redisStore({ ttl: 30000 }),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('redisConfigurationOptions'),
      inject: [ConfigService],
    }),
  ],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    RedisStoreService,
    {
      provide: Service.WEBSOCKET_SERVICE,
      useFactory: async (configService: ConfigService) =>
        ClientProxyFactory.create(
          configService.get('kafkaConfigurationOptions'),
        ),
      inject: [ConfigService],
    },
  ],
})
export class MatchingModule {}
