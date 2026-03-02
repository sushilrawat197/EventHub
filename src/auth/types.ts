export type IsoDateString = string;

export type AuthTokens = {
  accessToken: string;
  accessTokenExpiry: IsoDateString;
};

export type LoginResponse = {
  statusCode: number;
  message?: string;
  data: AuthTokens & {
    // Backend-specific extras (optional)
    refreshTokenExpiry?: IsoDateString;
    tempToken?: string;
    pwdChangeToken?: string;
  };
};

export type RefreshResponse = {
  statusCode: number;
  message?: string;
  data: AuthTokens;
};

