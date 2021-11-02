import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { UserEntity } from '@entity/users.entity';
import { HttpException } from '@exceptions/HttpException';
import {
  DataStoredInAccessToken,
  DataStoredInRefreshToken,
  RequestWithUser,
} from '@interfaces/auth.interface';
import HttpStatusCode from '@interfaces/http-codes.interface';
import { JsonWebToken } from '../utils/jwt';

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
      const userRepository = getRepository(UserEntity);
      const findUser = await userRepository.findOne(userId, {
        select: ['id', 'email'],
      });

      if (findUser) {
        req.user = findUser;
        next();
      }
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
      req.cookies['refreshToken'] || req.body.refreshToken || null;

    if (refreshToken) {
      const verificationResponse = (await jwt.verify(
        refreshToken,
        secretKey,
      )) as DataStoredInRefreshToken;

      const userId = verificationResponse.id;
      const userRepository = getRepository(UserEntity);
      const findUser = await userRepository.findOne(userId, {
        select: ['id', 'email'],
      });

      if (findUser) {
        req.user = findUser;
        next();
      }
    }
    next(unauthorizedError);
  } catch (error) {
    next(unauthorizedError);
  }
};

export default authMiddleware;
