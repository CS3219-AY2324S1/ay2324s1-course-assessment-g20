import { Controller, Get } from '@nestjs/common';
import { Public } from '../jwt/jwtPublic.decorator';

@Controller('/')
export class AppController {
  constructor() {}

  @Public()
  @Get()
  getAppRequest() {
    return 'Welcome to Peerprep!';
  }
}
