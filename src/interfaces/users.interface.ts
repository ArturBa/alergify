import { BaseInterface } from './base.interface';
import { FoodLog } from './food-logs.interface';
import { SymptomLog } from './symptom-logs.interface';

export interface User extends BaseInterface {
  email: string;
  password: string;
  username?: string;
  symptomLogs?: SymptomLog[];
  foodLogs?: FoodLog[];
}
