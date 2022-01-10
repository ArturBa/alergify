import { BaseInterface } from './base.interface';
import { Ingredient } from './ingredients.interface';
import { PaginateParameters } from './internal/parameters.interface';
import { RequestWithUser } from './internal/auth.interface';
import { User } from './users.interface';

export interface Allergen extends BaseInterface {
  user: User;
  ingredient: Ingredient;
  likelihood: number;
  confirmed: boolean;
}

export interface GetAllergensRequest
  extends PaginateParameters,
    RequestWithUser {}

export interface AllergenSetRequest
  extends RequestWithUser,
    PaginateParameters {
  ingredientId: number;
}
