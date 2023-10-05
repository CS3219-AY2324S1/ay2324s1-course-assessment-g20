import { Service } from '@app/interservice-api/services';
import { UserServiceApi } from '@app/interservice-api/user';
import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('languages')
export class LanguagesController {
  constructor(
    @Inject(Service.USER_SERVICE)
    private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  async getLanguages(@Req() req) {
    const languages = await firstValueFrom(
      this.userServiceClient.send(
        UserServiceApi.GET_ALL_LANGUAGES,
        req.user.id,
      ),
    );
    return languages;
  }
}
