import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Ingredient } from '@interfaces/ingredients.interface';
import { Product } from '@interfaces/products.interface';
import { User } from '@interfaces/users.interface';

import { BaseEntity } from './base.entity';
import { IngredientEntity } from './ingredients.entity';
import { UserEntity } from './users.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity implements Product {
  @Column({
    nullable: true,
  })
  barcode: number;

  @Column()
  name: string;

  @ManyToMany(() => IngredientEntity)
  @JoinTable()
  ingredients: Ingredient[];

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default ProductEntity;
