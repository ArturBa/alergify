import { NextFunction, Request, Response } from 'express';
import HttpException from '@exceptions/HttpException';
import { logger } from '@utils/logger';

const errorMiddleware = (
  httpError: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = httpError.status || 500;
    const message: string = httpError.message || 'Something went wrong';

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
    );
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
