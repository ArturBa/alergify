import { IsArray, IsISO8601, IsNotEmpty } from 'class-validator';

export class CreateSymptomLogDto {
  @IsISO8601()
  public date: string;

  @IsArray()
  @IsNotEmpty()
  public intensityLogs: number[];
}
