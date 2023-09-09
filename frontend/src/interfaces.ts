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
