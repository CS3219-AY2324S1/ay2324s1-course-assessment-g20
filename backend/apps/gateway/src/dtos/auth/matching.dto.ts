import { IsString, IsNotEmpty } from 'class-validator';

export default class MatchingDto {
  @IsString()
  @IsNotEmpty()
  questionDifficulty: string;
}
