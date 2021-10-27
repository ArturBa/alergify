import { BaseInterface } from './base.interface';
import { Symptom } from './symptoms.interface';

export interface IntensityLog extends BaseInterface {
  value: number;
  symptom?: Symptom;
}
