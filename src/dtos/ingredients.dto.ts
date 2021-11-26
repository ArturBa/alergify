/* eslint-disable import/prefer-default-export */
import { IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name: string;
}
