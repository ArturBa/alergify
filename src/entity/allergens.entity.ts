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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  ingredientId: number;

  @ManyToOne(() => IngredientEntity)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;

  @Column({ nullable: true })
  likelihood: number;

  @Column({
    default: false,
  })
  confirmed: boolean;
}

export default AllergensEntity;
