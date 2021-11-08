import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateIntensityLogDto {
  @IsInt()
  @Min(1)
  @Max(10)
  public value: number;

  @IsNotEmpty()
  public symptomId: number;
}
