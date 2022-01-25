import { BaseInterface } from './internal/base.interface';
import {
  DateParameters,
  PaginateParameters,
} from './internal/parameters.interface';
import { IntensityLog } from './intensity-logs.interface';
import { RequestWithUser } from './internal/auth.interface';
import { User } from './users.interface';

export interface SymptomLog extends BaseInterface {
  date: Date;
  intensityLogs?: IntensityLog[];
  user: User;
  userId: number;
}

export interface SymptomLogFindRequest
  extends RequestWithUser,
    DateParameters,
    PaginateParameters {}
