export type TActions = {
  setValue<T extends keyof TState>(state: T, value: TState[T]): void;
  signIn: (data: ISignInProps) => Promise<boolean>;
  signUp: (data: ISignUpProps) => Promise<boolean>;
  signOut: () => Promise<void>;
  getUser: () => Promise<IGetCurrentUser>;
};

export type TState = {
  user?: IGetCurrentUser;
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
  avatar: string;
  uid: string;
}
