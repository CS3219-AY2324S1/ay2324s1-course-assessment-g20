import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {
    // No implementation
  }

  @Get()
  getAppRequest() {
    return 'Welcome to Peerprep!';
  }
}
