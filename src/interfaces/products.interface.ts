import { BaseInterface } from './internal/base.interface';
import { Ingredient } from './ingredients.interface';
import {
  PaginateParameters,
  UserParameters,
} from './internal/parameters.interface';
import { RequestWithUser } from './internal/auth.interface';

export interface Product extends BaseInterface {
  barcode: string;
  name: string;
  ingredients?: Ingredient[];
  userId?: number;
}

interface FindProductsParameters {
  barcode?: string;
  name?: string;
}

export interface ProductGetRequest
  extends RequestWithUser,
    FindProductsParameters,
    PaginateParameters {}

export interface ProductFindRequest
  extends UserParameters,
    FindProductsParameters,
    PaginateParameters {}
