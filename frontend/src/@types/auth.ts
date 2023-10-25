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

export interface IWsTicket {
  id: string;
}
