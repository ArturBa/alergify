import { BaseInterface } from './base.interface';
import { RequestWithUser } from './internal/auth.interface';
import { PaginateParameters } from './internal/parameters.interface';

export interface Ingredient extends BaseInterface {
  name: string;
}

interface GetIngredientParameters {
  name?: string;
}

export interface IngredientGetRequest
  extends RequestWithUser,
    GetIngredientParameters,
    PaginateParameters {}
