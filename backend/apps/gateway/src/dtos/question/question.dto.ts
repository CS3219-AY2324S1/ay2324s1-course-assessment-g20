import { IsArray, IsString } from 'class-validator';

export default class QuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  difficulty: string;

  @IsArray()
  categories: string[];
}
