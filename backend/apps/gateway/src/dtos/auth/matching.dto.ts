import { IsString, IsNotEmpty } from 'class-validator';

export default class MatchingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  questionDifficulty: string;
}
