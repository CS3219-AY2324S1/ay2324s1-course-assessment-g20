import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { registerGrpcClients } from '@app/microservice/utils';
import { Service } from '@app/microservice/services';

@Module({
  imports: [registerGrpcClients([Service.USER_SERVICE])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class RolesModule {}
