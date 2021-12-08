/* eslint-disable import/prefer-default-export */
import { IsString } from 'class-validator';
import { decorate, Mixin } from 'ts-mixer';
import { PaginateDto } from './internal/parameters/paginate.dto';

export class CreateIngredientDto {
  @decorate(IsString())
  name: string;
}

export class GetIngredientDto extends Mixin(PaginateDto, CreateIngredientDto) {}
