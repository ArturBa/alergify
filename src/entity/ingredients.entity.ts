import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Ingredient } from '@interfaces/ingredients.interface';

@Entity()
@Unique(['name'])
export class IngredientEntity implements Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;
}
