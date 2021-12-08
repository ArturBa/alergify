/* eslint-disable import/prefer-default-export */
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { Mixin } from 'ts-mixer';

import { DateDto } from './internal/parameters/date.dto';
import { PaginateDto } from './internal/parameters/paginate.dto';

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

export class GetFoodLogsDto extends Mixin(PaginateDto, DateDto) {}
