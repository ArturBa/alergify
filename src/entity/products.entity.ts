import { Entity, Column, Unique, JoinTable, ManyToMany } from 'typeorm';
import { Product } from '@interfaces/products.interface';
import { Ingredient } from '@interfaces/ingredients.interface';
import { IngredientEntity } from './ingredients.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'products' })
@Unique(['name', 'barcode'])
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
}

export default ProductEntity;
