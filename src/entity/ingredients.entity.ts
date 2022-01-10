import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Ingredient } from '@interfaces/ingredients.interface';
import { User } from '@interfaces/users.interface';

import { BaseEntity } from './base.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'ingredients' })
export class IngredientEntity extends BaseEntity implements Ingredient {
  @Column()
  name: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default IngredientEntity;
