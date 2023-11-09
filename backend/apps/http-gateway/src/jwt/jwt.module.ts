import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [NestJwtModule],
  providers: [
    JwtStrategy,
    {
      // Global JWT app guard. Lets through endpoints with @Public decorator.
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class JwtModule {}
