import { Controller } from '@nestjs/common';
import { LanguageService } from './language.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @MessagePattern('get_all_languages')
  getAllLanguages() {
    return this.languageService.getAllLanguages();
  }
}
