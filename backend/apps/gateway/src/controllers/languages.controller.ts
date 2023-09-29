import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('languages')
export class LanguagesController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  async getLanguages(@Req() req) {
    const languages = await firstValueFrom(
      this.userServiceClient.send('get_all_languages', req.user.id),
    );
    return languages;
  }
}
