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
