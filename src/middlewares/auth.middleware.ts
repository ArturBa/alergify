import { NextFunction, Response } from 'express';
import HttpException from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import { JsonWebToken } from '@utils/jwt';

const unauthorizedError = new HttpException(
  HttpStatusCode.UNAUTHORIZED,
  'Unauthorized',
);

const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const Authorization = (authReq: RequestWithUser) => {
    return (
      authReq.cookies.Authorization ||
      authReq.header('Authorization').split('Bearer ')[1] ||
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
      } else {
        next(unauthorizedError);
      }
    } else {
      next(unauthorizedError);
    }
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
      req.cookies.refreshToken || req.body.refreshToken || null;

    if (refreshToken) {
      const verificationResponse =
        JsonWebToken.verifyRefreshToken(refreshToken);

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
