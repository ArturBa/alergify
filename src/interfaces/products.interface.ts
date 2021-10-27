import { Ingredient } from './ingredients.interface';

export interface Product {
  id: number;
  barcode: number;
  name: string;
  ingredients?: Ingredient[];
}
