import { BaseInterface } from './base.interface';
import { IntensityLog } from './intensity-logs.interface';
import { User } from './users.interface';

export interface SymptomLog extends BaseInterface {
  date: Date;
  intensityLogs?: IntensityLog[];
  user: User;
}
