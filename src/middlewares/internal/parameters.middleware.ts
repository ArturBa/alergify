import { RequestWithUser } from '@interfaces/internal/auth.interface';
import {
  DateParameters,
  PaginateParameters,
} from '@interfaces/internal/parameters.interface';
import { NextFunction, Response } from 'express';

const defaultStart = 0;
const defaultLimit = 10;

interface RequestPaginate extends RequestWithUser, PaginateParameters {}

export const paginateParamsMiddleware = (
  req: RequestPaginate,
  res: Response,
  next: NextFunction,
) => {
  try {
    const start = req.query.start as string;
    req.start = parseInt(start, 10) || defaultStart;

    const limit = req.query.limit as string;
    req.limit = parseInt(limit, 10) || defaultLimit;
    next();
  } catch (error) {
    next(error);
  }
};

interface RequestDate extends RequestWithUser, DateParameters {}
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
