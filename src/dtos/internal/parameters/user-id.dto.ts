import { UserParameters } from '@interfaces/internal/parameters.interface';
import { IsOptional } from 'class-validator';
import { decorate } from 'ts-mixer';

export class UserIdDto implements UserParameters {
  @decorate(IsOptional())
  userId: number;
}

export default UserIdDto;
