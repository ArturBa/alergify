import { NextFunction, Response } from 'express';


const defaultStart = 0;
const defaultLimit = 10;

const paginateMiddleware = (
  req: any,
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

export default paginateMiddleware;
