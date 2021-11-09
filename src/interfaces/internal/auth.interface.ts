import { Request } from 'express';

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
