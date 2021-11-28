import { RequestWithUser } from '@interfaces/internal/auth.interface';
import { DateParameters } from '@interfaces/internal/parameters.interface';
import { NextFunction, Response } from 'express';

export interface RequestDate extends RequestWithUser, DateParameters {}

export const dateParamsMiddleware = (
  req: RequestDate,
  res: Response,
  next: NextFunction,
) => {
  try {
    const start = req.query.startDate as string;
    req.startDate = start ? new Date(start) : null;

    const end = req.query.endDate as string;
    req.endDate = end ? new Date(end) : null;
    next();
  } catch (error) {
    next(error);
  }
};

export default dateParamsMiddleware;
