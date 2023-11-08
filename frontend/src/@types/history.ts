import { IQuestion } from './question';

export interface IAttempt {
  sessionId: string;
  questionId: string;
  dateTimeAttempted: Date;
}

export interface IRowAttempt {
  language: string;
  questionId: string;
  questionAttempt: string;
  dateTimeAttempted: Date;
}

export interface IHistoryTableRow {
  attempt: IRowAttempt;
  question: IQuestion;
}
