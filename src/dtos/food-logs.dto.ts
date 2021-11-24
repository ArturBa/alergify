import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateFoodLogDto {
  @IsISO8601()
  public date: string;

  @ValidateIf(o => o.products === [])
  @IsArray()
  @IsNotEmpty()
  public ingredients: number[];

  @ValidateIf(o => o.ingredients === [])
  @IsArray()
  @IsNotEmpty()
  public products: number[];
}

export class UpdateFoodLogDto extends CreateFoodLogDto {
  @IsInt()
  public id: number;
}
