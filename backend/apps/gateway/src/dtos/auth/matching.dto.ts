import { IsString, IsNotEmpty } from 'class-validator';

export default class MatchingDto {
  @IsString()
  @IsNotEmpty()
  ticket: string;

  @IsString()
  @IsNotEmpty()
  questionDifficulty: string;
}
