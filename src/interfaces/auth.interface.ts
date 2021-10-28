import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export enum DataTokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface DataStoredInAccessToken {
  type: DataTokenType;
  id: number;
}

export interface DataStoredInRefreshToken {
  type: DataTokenType;
  id: number;
  ip: string;
  isRefresh: boolean;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
