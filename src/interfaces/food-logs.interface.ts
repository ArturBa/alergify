import { BaseInterface } from './base.interface';
import { Ingredient } from './ingredients.interface';
import { RequestWithUser } from './internal/auth.interface';
import {
  DateParameters,
  PaginateParameters,
} from './internal/parameters.interface';
import { Product } from './products.interface';
import { User } from './users.interface';

export interface FoodLog extends BaseInterface {
  user?: User;
  date: Date;
  ingredients?: Ingredient[];
  products?: Product[];
}

export interface FoodLogGetRequest
  extends RequestWithUser,
    DateParameters,
    PaginateParameters {}
