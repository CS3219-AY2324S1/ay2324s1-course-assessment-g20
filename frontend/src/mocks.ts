import { ICategory, IDifficulty, IQuestion } from './interfaces';

export const loremIpsum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
export const questionCategoryStrings: ICategory = {
  id: 1,
  name: 'strings',
};
export const questionCategoryArrays: ICategory = {
  id: 2,
  name: 'arrays',
};
export const questionCategoryAlgorithms: ICategory = {
  id: 3,
  name: 'algorithms',
};

export const questionDifficultyEasy: IDifficulty = {
  id: 1,
  name: 'easy',
};

export const questionDifficultyMedium: IDifficulty = {
  id: 2,
  name: 'medium',
};

export const questionDifficultyHard: IDifficulty = {
  id: 3,
  name: 'hard',
};

export const exampleQuestion1: IQuestion = {
  id: 1,
  title: 'Reverse a String',
  description: loremIpsum,
  categories: [questionCategoryStrings, questionCategoryAlgorithms],
  difficulty: questionDifficultyEasy,
};

export const exampleQuestion2: IQuestion = {
  id: 2,
  title: 'Repeated DNA Sequences',
  description: loremIpsum,
  categories: [questionCategoryAlgorithms],
  difficulty: questionDifficultyMedium,
};

export const exampleQuestion3: IQuestion = {
  id: 3,
  title: 'Sliding Window Maximum',
  description: loremIpsum,
  categories: [questionCategoryArrays, questionCategoryAlgorithms],
  difficulty: questionDifficultyHard,
};

export const exampleQuestions: IQuestion[] = [exampleQuestion1, exampleQuestion2, exampleQuestion3];
