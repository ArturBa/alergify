import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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

  @ManyToMany(() => IngredientEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinTable()
  ingredients: Ingredient[];

  @ManyToMany(() => ProductEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinTable()
  products: Product[];

  @Column()
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.foodLogs, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'userId' })
  user: User;
}
