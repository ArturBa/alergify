/* eslint-disable import/prefer-default-export */
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Mixin } from 'ts-mixer';
import {
  CreateIntensityLogDto,
  UpdateIntensityLogDto,
} from './intensity-logs.dto';
import { PaginateDto, DateDto } from './internal/parameters.dto';

export class CreateSymptomLogDto {
  @IsISO8601()
  public date: string;

  @IsArray()
  @IsNotEmpty()
  // @ValidateNested()
  public intensityLogs: CreateIntensityLogDto[];
}

export class UpdateSymptomLogDto extends CreateSymptomLogDto {
  @IsInt()
  public id: number;

  public intensityLogs: UpdateIntensityLogDto[];
}

export class GetSymptomLogsDto extends Mixin(PaginateDto, DateDto) {}
