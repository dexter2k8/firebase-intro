export type TActions = {
  setValue<T extends keyof TState>(state: T, value: TState[T]): void;
  signIn: (data: ISignInProps) => Promise<boolean>;
  signUp: (data: ISignUpProps) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  getUser: () => Promise<IGetCurrentUser>;
};

export type TState = {
  userId?: string;
  isAdmin?: boolean;
};

export interface ISignInProps {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}

export interface ISignUpProps extends ISignInProps {
  confirmPassword: string;
}

export interface IGetCurrentUser {
  name: string;
  email: string;
  avatar?: string;
  uid?: string;
  role?: string;
  password?: string;
}
