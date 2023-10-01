import { IsString } from 'class-validator';

export default class DifficultyDto {
  @IsString()
  name: string;
}
