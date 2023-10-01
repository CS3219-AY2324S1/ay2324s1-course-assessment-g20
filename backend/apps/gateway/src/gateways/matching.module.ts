import { Module } from '@nestjs/common';
import { JwtStrategy } from '../jwt/jwt.strategy';

@Module({
  imports: [JwtStrategy],
})
export class JwtModule {}
