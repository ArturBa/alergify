/* eslint-disable import/prefer-default-export */
import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Mixin } from 'ts-mixer';

import { PaginateDto } from './internal/parameters/paginate.dto';

export class GetProductDto extends Mixin(PaginateDto) {
  @ValidateIf(o => o.barcode === undefined)
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  barcode: string;
}
