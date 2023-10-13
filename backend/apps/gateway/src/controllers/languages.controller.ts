import { Service } from '@app/microservice/interservice-api/services';
import { getPromisifiedGrpcService } from '@app/microservice/utils';
import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { LanguageController as UserLanguageService } from 'apps/user/src/language/language.controller';

@Controller('languages')
export class LanguagesController implements OnModuleInit {
  private userLanguageService: UserLanguageService;

  constructor(
    @Inject(Service.USER_SERVICE) private userServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userLanguageService = getPromisifiedGrpcService<UserLanguageService>(
      this.userServiceClient,
      'UserLanguageService',
    );
  }

  @Get()
  getLanguages() {
    return this.userLanguageService
      .getAllLanguages({})
      .then((resp) => resp.languages);
  }
}
