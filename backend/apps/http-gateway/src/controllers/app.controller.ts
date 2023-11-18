import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Public } from '../jwt/jwtPublic.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Public()
  @Get()
  getAppRequest() {
    return 'Welcome to Peerprep!';
  }

  @Public()
  @Get('loadtesting')
  // NOTE: Endpoint added solely for the purpose of testing out the Horizontal Pod Autoscaler in K8s during the final presentation.
  // To teaching team: This endpoint should not exist in real life production systems.
  loadTestingEndpoint() {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const timestamp = Date.now();
    while (Date.now() - timestamp < 2000) {
      // No implementation
    }
    return 'Running CPU intensive task...';
  }
}
