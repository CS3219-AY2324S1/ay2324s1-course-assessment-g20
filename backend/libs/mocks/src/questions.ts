import { Question } from '@app/microservice/interfaces/question';
import {
  MOCK_DIFFICULTY_1,
  MOCK_DIFFICULTY_2,
  MOCK_DIFFICULTY_3,
} from './difficulties';
import {
  MOCK_CATEGORY_1,
  MOCK_CATEGORY_2,
  MOCK_CATEGORY_3,
} from './categories';
import {
  MOCK_QUESTION_DESCRIPTION_1,
  MOCK_QUESTION_DESCRIPTION_2,
  MOCK_QUESTION_DESCRIPTION_3,
} from './questionDescriptions';

export const MOCK_QUESTION_1_TITLE = 'Mock Question 1 Title';
export const MOCK_QUESTION_1: Question = {
  title: MOCK_QUESTION_1_TITLE,
  description: MOCK_QUESTION_DESCRIPTION_1,
  difficulty: MOCK_DIFFICULTY_1,
  categories: [MOCK_CATEGORY_1],
};

export const MOCK_QUESTION_2_TITLE = 'Mock Question 2 Title';
export const MOCK_QUESTION_2: Question = {
  title: MOCK_QUESTION_2_TITLE,
  description: MOCK_QUESTION_DESCRIPTION_2,
  difficulty: MOCK_DIFFICULTY_2,
  categories: [MOCK_CATEGORY_2],
};

export const MOCK_QUESTION_3_TITLE = 'Mock Question 3 Title';
export const MOCK_QUESTION_3: Question = {
  title: MOCK_QUESTION_3_TITLE,
  description: MOCK_QUESTION_DESCRIPTION_3,
  difficulty: MOCK_DIFFICULTY_3,
  categories: [MOCK_CATEGORY_3],
};
