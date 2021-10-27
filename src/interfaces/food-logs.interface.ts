import { BaseInterface } from './base.interface';
import { Ingredient } from './ingredients.interface';
import { Product } from './products.interface';
import { User } from './users.interface';

export interface FoodLog extends BaseInterface {
  user?: User;
  date: Date;
  ingredients?: Ingredient[];
  products?: Product[];
}
