import { UserTokenDto } from './user-token-dto';

export interface LoginResponse {
    accessToken: string;
    expiresIn: number;
    userToken: UserTokenDto;
  }