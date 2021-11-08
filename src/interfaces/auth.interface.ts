import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInAccessToken {
  id: number;
}

export interface DataStoredInRefreshToken {
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
  userId: number;
}
