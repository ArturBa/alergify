import { BaseInterface } from './base.interface';
import { Ingredient } from './ingredients.interface';
import { RequestWithUser } from './internal/auth.interface';
import {
  DateParameters,
  PaginateParameters,
  UserParameters,
} from './internal/parameters.interface';
import { Product } from './products.interface';
import { User } from './users.interface';

export interface FoodLog extends BaseInterface {
  user?: User;
  userId?: number;
  date: Date;
  ingredients?: Ingredient[];
  products?: Product[];
}

export interface FoodLogGetRequest
  extends RequestWithUser,
    DateParameters,
    PaginateParameters {}

export interface FoodLogFindRequest
  extends UserParameters,
    DateParameters,
    PaginateParameters {}
