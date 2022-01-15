import { PaginateParameters } from '@interfaces/internal/parameters.interface';
import { IsInt, IsOptional, Min } from 'class-validator';
import { decorate } from 'ts-mixer';

export class PaginateDto implements PaginateParameters {
  @decorate(IsOptional())
  @decorate(Min(0))
  @decorate(IsInt())
  start: number;

  @decorate(IsOptional())
  @decorate(Min(1))
  @decorate(IsInt())
  limit: number;
}

export default PaginateDto;
