/* eslint-disable import/prefer-default-export */
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Mixin } from 'ts-mixer';

import { PaginateDto } from './internal/parameters/paginate.dto';
import { UserIdDto } from './internal/parameters/user-id.dto';

export class ProductCreateDto extends Mixin(UserIdDto) {
  @IsOptional()
  @IsNumber()
  public barcode: number;

  @IsString()
  name: string;

  @IsArray()
  @IsNotEmpty()
  ingredients: number[];
}

export class GetProductDto extends Mixin(PaginateDto) {
  @ValidateIf(o => o.name === undefined)
  @IsString()
  name: string;

  @ValidateIf(o => o.name === undefined)
  @IsNumber()
  barcode: number;
}
