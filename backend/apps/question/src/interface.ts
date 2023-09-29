import { Question } from './schemas/question.schema';

export type QuestionWithCategoryAndDifficulty = Pick<
  Question,
  'id' | 'title' | 'description'
> & {
  categories: string[];
  difficulty: string;
};
