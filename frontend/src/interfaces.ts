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
  id: string;
  title: string;
  categories: Category[];
  difficulty: Difficulty;
  description: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Difficulty {
  id: string;
  name: string;
}
