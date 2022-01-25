import { NextFunction, Response } from 'express';

import { IngredientFindDto } from '@dtos/ingredients.dto';
import { IngredientFindRequest } from '@interfaces/ingredients.interface';
import { isEmpty } from '@utils/util';

import { paginateParamsMiddleware } from './internal/paginate.middleware';
import validationMiddleware from './validation.middleware';

const getIngredientsDtoMiddleware = (
  req: IngredientFindRequest,
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

export const ingredientsFindMiddleware = [
  validationMiddleware(IngredientFindDto, 'query'),
  paginateParamsMiddleware,
  getIngredientsDtoMiddleware,
];

export default ingredientsFindMiddleware;
