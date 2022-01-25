import { NextFunction, Response } from 'express';

import { FoodGetRequest } from '@interfaces/foods.interface';

import { paginateParamsMiddleware } from './internal/paginate.middleware';

const getFoodDtoMiddleware = (
  req: FoodGetRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name = (req.query.name as string) || '';
    const barcode = (req.query.barcode as string) || undefined;
    req.name = name;
    req.barcode = barcode;
    next();
  } catch (error) {
    next(error);
  }
};

export const getFoodsMiddleware = [
  paginateParamsMiddleware,
  getFoodDtoMiddleware,
];

export default getFoodsMiddleware;
