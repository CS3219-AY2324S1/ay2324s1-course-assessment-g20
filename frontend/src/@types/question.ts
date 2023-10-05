export interface IQuestion {
  _id?: string;
  title: string;
  categories: string[];
  difficulty: string;
  description: string;
}

export interface IDifficulty {
  _id: string;
  name: string;
}

export interface ICategory {
  _id: string;
  name: string;
}

export const EMPTY_QUESTION: IQuestion = {
  title: '',
  description: '',
  difficulty: '',
  categories: [],
};
