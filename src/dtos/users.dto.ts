/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @IsOptional()
  public username: string;
}
