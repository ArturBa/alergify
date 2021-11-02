import config from 'config';
import jwt from 'jsonwebtoken';

import {
  DataStoredInAccessToken,
  DataStoredInRefreshToken,
  TokenData,
} from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

export class JsonWebToken {
  protected static readonly accessTokenTimeout =
    (config.get('accessTokenTimeout') as number) || 60 * 60; // 1 hour
  protected static readonly refreshTokenTimeout =
    (config.get('refreshTokenTimeout') as number) || '7d';
  protected static readonly secret =
    (config.get('jwtSecret') as string) || 'secret';

  protected static createAccessToken(user: User): string {
    console.log(user);
    const data: DataStoredInAccessToken = {
      id: user.id,
    };
    console.log(this.accessTokenTimeout);
    return jwt.sign(data, this.secret, { expiresIn: this.accessTokenTimeout });
  }

  protected static createRefreshToken(user: User): string {
    const data: DataStoredInRefreshToken = {
      id: user.id,
      isRefresh: true,
      ip: '',
    };
    return jwt.sign(data, this.secret, { expiresIn: this.refreshTokenTimeout });
  }

  static verifyAccessToken(token: string): DataStoredInAccessToken {
    console.trace('verify: ', jwt.verify(token, this.secret));
    // console.trace('verify async: ', await jwt.verify(token, this.secret));
    return jwt.verify(token, this.secret) as DataStoredInAccessToken;
  }

  static createToken(user: User): TokenData {
    const accessToken = this.createAccessToken(user);
    const refreshToken = this.createRefreshToken(user);

    return {
      expiresIn: this.accessTokenTimeout,
      accessToken,
      refreshToken,
    };
  }

  static createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.accessToken}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
