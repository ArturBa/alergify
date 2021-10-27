import { IntensityLog } from './intensity-logs.interface';
import { User } from './users.interface';

export interface SymptomLog {
  id: number;
  date: Date;
  intensityLogs?: IntensityLog[];
  user: User;
}
