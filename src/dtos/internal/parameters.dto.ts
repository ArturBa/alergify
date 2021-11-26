/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */

import { DateParameters, PaginateParameters } from "@interfaces/internal/parameters.interface";
import { IsInt, IsISO8601, IsOptional, IsString, Min } from "class-validator";

export class PaginateDto implements PaginateParameters {
  @IsOptional()
  @IsInt()
  @Min(0)
  start: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number;
}

export class DateDto implements DateParameters {
  @IsOptional()
  @IsString()
  @IsISO8601()
  startDate: string;

  @IsOptional()
  @IsString()
  @IsISO8601()
  endDate: string;
}
