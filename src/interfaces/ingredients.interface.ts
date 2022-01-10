import { BaseInterface } from './base.interface';
import { RequestWithUser } from './internal/auth.interface';
import { PaginateParameters } from './internal/parameters.interface';
import { User } from './users.interface';

export interface Ingredient extends BaseInterface {
  name: string;
  user?: User;
}

interface GetIngredientParameters {
  name?: string;
}

export interface IngredientGetRequest
  extends RequestWithUser,
    GetIngredientParameters,
    PaginateParameters {}
