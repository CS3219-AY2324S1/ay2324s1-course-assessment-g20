import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IConstantsService {
  NODE_ENV: string;
  PORT: string;
  CORS_ORIGIN: string;
}

@Injectable()
export class ConstantsService implements IConstantsService {
  constructor(private readonly configService: ConfigService) {}

  private get(varname: string) {
    return this.configService.get(varname);
  }

  private getOrThrow(varname: string) {
    return this.configService.getOrThrow(varname);
  }

  private getOrDefaultTo(varname: string, defaultTo?: string | number) {
    return this.configService.get(varname) || defaultTo;
  }

  NODE_ENV = this.get('NODE_ENV');
  PORT = this.getOrDefaultTo('PORT', 4000);
  CORS_ORIGIN = this.getOrThrow('CORS_ORIGIN');
}
