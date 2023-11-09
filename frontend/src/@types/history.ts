import { IQuestion } from './question';

export interface IAttempt {
  attemptText: string;
  dateTimeAttempted: Date;
  questionId: string;
  languageId: number;
}

export interface IHistoryTableRow {
  attempt: IAttempt;
  question: IQuestion;
  language: string;
}
