import { Controller } from '@nestjs/common';
import { LanguageService } from './language.service';
import { GrpcMethod } from '@nestjs/microservices';

const UserLanguageServiceGrpcMethod: MethodDecorator = GrpcMethod(
  'UserLanguageService',
);

@Controller()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @UserLanguageServiceGrpcMethod
  getAllLanguages({}) {
    return this.languageService
      .getAllLanguages()
      .then((languages) => ({ languages }));
  }
}
