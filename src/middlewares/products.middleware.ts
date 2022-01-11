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
    if (isEmpty(name) && isEmpty(barcode)) {
      throw new Error('name or barcode is required');
    }
    req.name = name;
    req.barcode = parseInt(barcode, 10) || undefined;
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
