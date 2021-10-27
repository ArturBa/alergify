import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { IngredientEntity } from './ingredients.entity';
import { Ingredient } from '@interfaces/ingredients.interface';
import { FoodLog } from '@interfaces/food-logs.interface';
import { Product } from '@interfaces/products.interface';
import { ProductEntity } from './products.entity';
import { UserEntity } from './users.entity';
import { User } from '../interfaces/users.interface';

@Entity()
export class FoodLogEntity implements FoodLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  date: Date;

  @ManyToMany(() => IngredientEntity)
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => ProductEntity)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => UserEntity, user => user.foodLogs)
  user: User;
}
