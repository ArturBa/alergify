/* eslint-disable import/prefer-default-export */
import { IsString, ValidateIf } from 'class-validator';
import { Mixin } from 'ts-mixer';

import { PaginateDto } from './internal/parameters/paginate.dto';

export class GetProductDto extends Mixin(PaginateDto) {
  @ValidateIf(o => o.barcode === undefined)
  @IsString()
  name: string;
}
