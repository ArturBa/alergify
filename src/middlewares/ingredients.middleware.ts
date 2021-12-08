import { NextFunction, Response } from 'express';
import { IngredientGetRequest } from '@interfaces/ingredients.interface';
import { paginateParamsMiddleware } from './internal/paginate.middleware';
import { isEmpty } from '../utils/util';

const getIngredientsDtoMiddleware = (
  req: IngredientGetRequest,
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

export const getIngredientsMiddleware = [
  paginateParamsMiddleware,
  getIngredientsDtoMiddleware,
];

export default getIngredientsMiddleware;