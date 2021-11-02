import { IsNotEmpty } from 'class-validator';
import { Entity, Column, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { FoodLog } from '@interfaces/food-logs.interface';
import { Ingredient } from '@interfaces/ingredients.interface';
import { Product } from '@interfaces/products.interface';
import { User } from '@interfaces/users.interface';

import { BaseEntity } from './base.entity';
import { IngredientEntity } from './ingredients.entity';
import { ProductEntity } from './products.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'food_logs' })
export class FoodLogEntity extends BaseEntity implements FoodLog {
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
