import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  getAppRequest() {
    return 'Welcome to Peerprep!';
  }
}
