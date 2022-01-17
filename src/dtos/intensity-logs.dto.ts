/* eslint-disable import/prefer-default-export */
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { Mixin } from 'ts-mixer';

import { UserIdDto } from './internal/parameters/user-id.dto';

export class CreateIntensityLogDto extends Mixin(UserIdDto) {
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
