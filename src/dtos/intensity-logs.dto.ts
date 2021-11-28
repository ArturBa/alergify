/* eslint-disable import/prefer-default-export */
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateIntensityLogDto {
  @IsInt()
  @Min(1)
  @Max(10)
  public value: number;

  @IsNotEmpty()
  public symptomId: number;
}

export class UpdateIntensityLogDto extends CreateIntensityLogDto {
  @IsInt()
  @IsOptional()
  public id: number;
}
