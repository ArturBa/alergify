import { PaginateParameters } from '@interfaces/internal/parameters.interface';
import { IsInt, IsOptional, Min } from 'class-validator';
import { decorate } from 'ts-mixer';

export class PaginateDto implements PaginateParameters {
  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(Min(0))
  start: number;

  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(Min(1))
  limit: number;
}

export default PaginateDto;
