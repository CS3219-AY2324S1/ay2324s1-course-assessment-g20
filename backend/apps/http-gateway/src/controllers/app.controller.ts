import { Controller, Get } from '@nestjs/common';
import { Public } from '../jwt/jwtPublic.decorator';

@Controller('/')
export class AppController {
  constructor() {
    // No implementation
  }

  @Public()
  @Get()
  getAppRequest() {
    return 'Welcome to Peerprep!';
  }
}
