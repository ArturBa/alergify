import { Symptom } from './symptoms.interface';

export interface IntensityLog {
  id: number;
  value: number;
  symptom?: Symptom;
}
