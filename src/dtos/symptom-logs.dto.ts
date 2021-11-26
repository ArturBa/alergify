/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import {
  CreateIntensityLogDto,
  UpdateIntensityLogDto,
} from './intensity-logs.dto';

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

export class PaginateSymptomLogDto {

}
