import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Allergen } from '@interfaces/allergens.interface';
import { Ingredient } from '@interfaces/ingredients.interface';
import { User } from '@interfaces/users.interface';

import { BaseEntity } from './base.entity';
import { IngredientEntity } from './ingredients.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'allergens' })
export class AllergensEntity extends BaseEntity implements Allergen {
  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  ingredientId: number;

  @ManyToOne(() => IngredientEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({
    default: false,
  })
  confirmed: boolean;

  @Column({
    default: 0,
  })
  count: number;

  @Column({
    default: 0,
  })
  points: number;
}

export default AllergensEntity;
