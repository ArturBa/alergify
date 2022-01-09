import { RequestWithUser } from './internal/auth.interface';
import { PaginateParameters } from './internal/parameters.interface';

export interface Food {
  id: number;
  type: 'product' | 'ingredient';
  name: string;
  barcode?: number;
}

interface GetFoodsParameters {
  name: string;
}

export interface FoodGetRequest
  extends RequestWithUser,
    GetFoodsParameters,
    PaginateParameters {}
