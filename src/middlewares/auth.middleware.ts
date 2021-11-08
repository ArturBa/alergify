import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import {
  DataStoredInRefreshToken,
  RequestWithUser,
} from '@interfaces/auth.interface';
import HttpStatusCode from '@interfaces/http-codes.interface';
import { JsonWebToken } from '@utils/jwt';

const unauthorizedError = new HttpException(
  HttpStatusCode.UNAUTHORIZED,
  'Unauthorized',
);

const secretKey: string = config.get('jwtSecret') || 'secret';

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const Authorization = (req: RequestWithUser) => {
    return (
      req.cookies['Authorization'] ||
      req.header('Authorization').split('Bearer ')[1] ||
      null
    );
  };

  try {
    const authorization = Authorization(req);

    if (authorization) {
      const verificationResponse =
        JsonWebToken.verifyAccessToken(authorization);

      const userId = verificationResponse.id;
      if (userId) {
        req.userId = userId;
        next();
      }
    }
    next(unauthorizedError);
  } catch (error) {
    next(unauthorizedError);
  }
};

export const refreshTokenMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken =
      req.cookies['refreshToken'] || req.body.refreshToken || null;

    if (refreshToken) {
      const verificationResponse = (await jwt.verify(
        refreshToken,
        secretKey,
      )) as DataStoredInRefreshToken;

      const userId = verificationResponse.id;

      req.userId = userId;
      next();
    }
    next(unauthorizedError);
  } catch (error) {
    next(unauthorizedError);
  }
};

export default authMiddleware;
