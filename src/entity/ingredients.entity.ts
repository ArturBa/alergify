import { IsNotEmpty } from 'class-validator';
import { Entity, Column, Unique } from 'typeorm';

import { Ingredient } from '@interfaces/ingredients.interface';
import { BaseEntity } from './base.entity';

@Entity({ name: 'ingredients' })
@Unique(['name'])
export class IngredientEntity extends BaseEntity implements Ingredient {
  @Column()
  @IsNotEmpty()
  name: string;
}

export default IngredientEntity;
