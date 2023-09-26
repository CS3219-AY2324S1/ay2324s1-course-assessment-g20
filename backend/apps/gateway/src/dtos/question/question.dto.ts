import { Type } from 'class-transformer';
import { DifficultyDto } from './difficulty.dto';
import { IsString, ValidateNested } from 'class-validator';
import { CategoryDto } from './category.dto';

export default class QuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => DifficultyDto)
  @ValidateNested()
  difficulty: DifficultyDto;

  @Type(() => CategoryDto)
  @ValidateNested()
  categories: CategoryDto[];
}
