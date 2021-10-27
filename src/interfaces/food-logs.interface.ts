import { Ingredient } from './ingredients.interface';
import { Product } from './products.interface';
import { User } from './users.interface';

export interface FoodLog {
  id: number;
  user?: User;
  date: Date;
  ingredients?: Ingredient[];
  products?: Product[];
}
