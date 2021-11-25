/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
import { IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name: string;
}
