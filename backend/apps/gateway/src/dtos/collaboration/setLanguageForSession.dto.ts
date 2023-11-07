import { IsNumber } from 'class-validator';

export default class SetLanguageForSessionDto {
  @IsNumber()
  languageId: number;
}
