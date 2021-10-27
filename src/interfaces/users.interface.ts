import { FoodLog } from './food-logs.interface';
import { SymptomLog } from './symptom-logs.interface';

export interface User {
  id: number;
  email: string;
  password: string;
  username?: string;
  symptomLogs?: SymptomLog[];
  foodLogs?: FoodLog[];
}
