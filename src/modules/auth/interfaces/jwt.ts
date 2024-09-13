export interface DecodedUserInfoInJwt {
  userId: string;
  sub: string;
  iat?: number;
  exp?: number;
}

export interface UserInfoInJwt {
  userId: string;
}
