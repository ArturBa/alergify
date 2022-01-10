import { BaseInterface } from './base.interface';
import { Ingredient } from './ingredients.interface';
import { RequestWithUser } from './internal/auth.interface';
import { PaginateParameters } from './internal/parameters.interface';

export interface Product extends BaseInterface {
  barcode: number;
  name: string;
  ingredients?: Ingredient[];
  userId?: number;
}

interface GetProductsParameters {
  barcode?: number;
  name?: string;
}

export interface ProductGetRequest
  extends RequestWithUser,
    GetProductsParameters,
    PaginateParameters {}
