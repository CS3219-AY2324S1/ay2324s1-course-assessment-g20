export interface IAuth {
  userId: string;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  getAuthStore: () => IAuth | null;
  signIn: (auth: IAuth) => void;
  signout: () => void;
}

export interface CreatedUser {
  id: string;
  name: string;
}
