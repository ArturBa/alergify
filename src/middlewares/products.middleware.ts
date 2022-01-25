import { NextFunction, Response } from 'express';

import { isEmpty } from '@utils/util';
import { ProductGetRequest } from '@interfaces/products.interface';

import { paginateParamsMiddleware } from './internal/paginate.middleware';

const getProductsDtoMiddleware = (
  req: ProductGetRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const name = req.query.name as string;
    const barcode = req.query.barcode as string;
    req.name = name;
    req.barcode = barcode || undefined;
    next();
  } catch (error) {
    next(error);
  }
};

export const getProductsMiddleware = [
  paginateParamsMiddleware,
  getProductsDtoMiddleware,
];

export default getProductsMiddleware;
