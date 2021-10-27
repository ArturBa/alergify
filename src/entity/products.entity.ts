import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Product } from '@interfaces/products.interface';
import { Ingredient } from '../interfaces/ingredients.interface';
import { IngredientEntity } from './ingredients.entity';

@Entity()
export class ProductEntity implements Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barcode: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => IngredientEntity)
  @JoinTable()
  ingredients: Ingredient[];
}
