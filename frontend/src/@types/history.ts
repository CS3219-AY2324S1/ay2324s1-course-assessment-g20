import { IQuestion } from './question';

export interface IAttempt {
  languageId: number;
  questionId: string;
  questionAttempt: string;
  dateTimeAttempted: Date;
}

export interface IHistoryTableRow {
  question: IQuestion;
  attempt: IAttempt;
}
