import { IsString } from 'class-validator';

export default class HistoryAttemptDto {
  @IsString()
  sessionId: string;

  @IsString()
  questionAttempt: string;
}
