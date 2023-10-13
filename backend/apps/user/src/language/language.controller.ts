import { Controller } from '@nestjs/common';
import { LanguageService } from './language.service';
import {
  UserLanguageServiceController,
  UserLanguageServiceControllerMethods,
} from '@app/microservice/interfaces/user';

@Controller()
@UserLanguageServiceControllerMethods()
export class LanguageController implements UserLanguageServiceController {
  constructor(private readonly languageService: LanguageService) {}

  getAllLanguages() {
    return this.languageService
      .getAllLanguages()
      .then((languages) => ({ languages }));
  }
}
