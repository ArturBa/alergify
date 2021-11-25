/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  public barcode: number;

  @IsString()
  name: string;

  @IsArray()
  @IsNotEmpty()
  ingredients: number[];
}
