import { BaseInterface } from './base.interface';
import { Ingredient } from './ingredients.interface';

export interface Product extends BaseInterface {
  barcode: number;
  name: string;
  ingredients?: Ingredient[];
}
