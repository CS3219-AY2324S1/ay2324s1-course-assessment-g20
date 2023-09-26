export interface IAuth {
  refreshToken: string;
  accessToken: string;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  getAuthStore: () => IAuth | null;
  redirectToSignIn: () => void;
  signIn: (auth: IAuth) => void;
  signout: () => void;
}

export interface ICodeEvalOutput {
  logs: string;
  result: string;
  error: string;
}

export interface Question {
  _id?: string;
  title: string;
  categories: string[];
  difficulty: string;
  description: string;
}
export interface Difficulty {
  id: string;
  name: string;
}
export interface Category {
  id: string;
  name: string;
}

export const EMPTY_QUESTION: Question = {
  title: '',
  description: '',
  difficulty: '',
  categories: [],
};
