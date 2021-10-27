import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@interfaces/products.interface';
import { Ingredient } from '../interfaces/ingredients.interface';
import { IngredientEntity } from './ingredients.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['name', 'barcode'])
export class ProductEntity extends BaseEntity implements Product {
  @Column()
  barcode: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToMany(() => IngredientEntity)
  @JoinTable()
  ingredients: Ingredient[];
}
