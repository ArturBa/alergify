import { BaseInterface } from './base.interface';
import { IntensityLog } from './intensity-logs.interface';
import { RequestWithUser } from './internal/auth.interface';
import { DateParameters, PaginateParameters } from './internal/parameters.interface';
import { User } from './users.interface';

export interface SymptomLog extends BaseInterface {
  date: Date;
  intensityLogs?: IntensityLog[];
  user: User;
}

export interface SymptomLogGetRequest extends RequestWithUser, DateParameters, PaginateParameters {

}
