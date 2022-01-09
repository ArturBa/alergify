import { NextFunction, Response } from 'express';

import { FoodGetRequest } from '@interfaces/foods.interface';
import { isEmpty } from '@utils/util';

import { paginateParamsMiddleware } from './internal/paginate.middleware';

const getFoodDtoMiddleware = (
  req: FoodGetRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name = req.query.name as string;
    if (isEmpty(name)) {
      throw new Error('name is required');
    }
    req.name = name;
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
