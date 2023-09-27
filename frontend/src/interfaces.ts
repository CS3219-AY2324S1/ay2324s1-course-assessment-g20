export interface IAuth {
  refreshToken: string;
  accessToken: string;
}

export interface IAuthContext {
  authState: IAuth | null;
  redirectToSignIn: () => void;
  signIn: (auth: IAuth) => void;
  signout: () => void;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IDifficulty {
  id: number;
  name: string;
}

export interface IQuestion {
  id: number;
  title: string;
  description?: string; // Don't return this field to dashboard
  difficulty: IDifficulty;
  categories: ICategory[];
}

export interface ICodeEvalOutput {
  logs: string;
  result: string;
  error: string;
}
