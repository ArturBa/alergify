import { BaseUserInterface } from './internal/base.interface';
import { RequestWithUser } from './internal/auth.interface';
import { PaginateParameters } from './internal/parameters.interface';

export interface Ingredient extends BaseUserInterface {
  name: string;
}

interface IngredientFindParameters {
  name: string;
}

export interface IngredientFindRequest
  extends RequestWithUser,
    IngredientFindParameters,
    PaginateParameters {}
