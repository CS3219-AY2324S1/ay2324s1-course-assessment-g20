import { IQuestion } from './question';

export interface IAttempt {
  questionId: string;
  questionAttempt: string;
  dateTimeAttempted: Date;
}

export interface IHistoryTableRow {
  question: IQuestion;
  attempt: IAttempt;
}
