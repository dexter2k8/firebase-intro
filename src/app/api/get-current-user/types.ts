export interface IFirebaseUser {
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;

  firebase: {
    identities: {
      email: string[];
      sign_in_provider: string;
    };
  };
  iat: number;
  iss: string;
  name: string;
  picture: string;
  sub: string;
  user_id: string;
  token: string;
}

export interface IGetCurrentUser {
  name: string;
  email: string;
  avatar: string;
}
