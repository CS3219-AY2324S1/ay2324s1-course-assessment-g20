import { Category } from './schemas/category.schema';
import { Difficulty } from './schemas/difficulty.schema';
import { Question } from './schemas/question.schema';

export type QuestionWithCategoryAndDifficulty = Question & {
  categories: Category[];
  difficulty: Difficulty;
};
