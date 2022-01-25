import { BaseInterface } from './internal/base.interface';
import { Ingredient } from './ingredients.interface';
import {
  PaginateParameters,
  UserParameters,
} from './internal/parameters.interface';
import { RequestWithUser } from './internal/auth.interface';
import { User } from './users.interface';

export interface Allergen extends BaseInterface {
  user: User;
  ingredient: Ingredient;
  points: number;
  confirmed: boolean;
}

export interface GetAllergensRequest
  extends PaginateParameters,
    RequestWithUser {}

export interface AllergenSetParameters extends UserParameters {
  ingredientId: number;
}
