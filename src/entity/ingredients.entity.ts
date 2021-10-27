import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Ingredient } from '@interfaces/ingredients.interface';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['name'])
export class IngredientEntity extends BaseEntity implements Ingredient {
  @Column()
  @IsNotEmpty()
  name: string;
}