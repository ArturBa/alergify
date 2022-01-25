import { decorate, Mixin } from 'ts-mixer';
import { IsString } from 'class-validator';

import { PaginateDto } from './internal/parameters/paginate.dto';
import { UserIdDto } from './internal/parameters/user-id.dto';

export class IngredientCreateDto extends Mixin(UserIdDto) {
  @decorate(IsString())
  name: string;
}

export class IngredientFindDto extends Mixin(
  PaginateDto,
  IngredientCreateDto,
  UserIdDto,
) {}
