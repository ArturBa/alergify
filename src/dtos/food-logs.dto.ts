/* eslint-disable import/prefer-default-export */
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Mixin } from 'ts-mixer';

import { DateDto } from './internal/parameters/date.dto';
import { PaginateDto } from './internal/parameters/paginate.dto';

export class CreateFoodLogDto {
  @IsOptional()
  public userId?: number;

  @IsISO8601()
  public date: string;

  @IsArray()
  @ValidateIf(o => o.products === [])
  @IsNotEmpty()
  public ingredients: number[];

  @IsArray()
  @ValidateIf(o => o.ingredients === [])
  @IsNotEmpty()
  public products: number[];
}

export class UpdateFoodLogDto extends CreateFoodLogDto {
  @IsInt()
  public id: number;
}

export class FindFoodLogsDto extends Mixin(PaginateDto, DateDto) {}
