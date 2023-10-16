import {
  USER_LANGUAGE_SERVICE_NAME,
  UserLanguageServiceClient,
} from '@app/microservice/interfaces/user';
import { Service } from '@app/microservice/services';
import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('languages')
export class LanguagesController implements OnModuleInit {
  private userLanguageService: UserLanguageServiceClient;

  constructor(
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userLanguageService =
      this.userServiceClient.getService<UserLanguageServiceClient>(
        USER_LANGUAGE_SERVICE_NAME,
      );
  }

  @Get()
  getLanguages() {
    return firstValueFrom(this.userLanguageService.getAllLanguages({})).then(
      (resp) => resp.languages || [],
    );
  }
}
