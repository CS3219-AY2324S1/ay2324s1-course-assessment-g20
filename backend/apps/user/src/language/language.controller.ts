import { Controller } from '@nestjs/common';
import { LanguageService } from './language.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserServiceApi } from '@app/interservice-api/user';

@Controller()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @MessagePattern(UserServiceApi.GET_ALL_LANGUAGES)
  getAllLanguages() {
    return this.languageService.getAllLanguages();
  }
}
