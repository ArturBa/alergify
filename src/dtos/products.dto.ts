import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
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
