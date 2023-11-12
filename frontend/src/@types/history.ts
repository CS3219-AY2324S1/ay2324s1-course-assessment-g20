import { IQuestion } from './question';

export interface IAttempt {
  attemptTextByLanguageId: { [key: number]: string };
  dateTimeAttempted: Date;
  question: IQuestion;
  languageId: number;
  sessionId: string;
}

export interface IHistoryTableRow {
  attempt: IAttempt;
  question: IQuestion;
  language: string;
}
