import { IsNotEmpty } from 'class-validator';
import { Entity, Column, OneToOne, JoinColumn, Check } from 'typeorm';

import { Symptom } from '@interfaces/symptoms.interface';
import { IntensityLog } from '@interfaces/intensity-logs.interface';

import { SymptomEntity } from './symptoms.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Check(`"value" > 0 AND "value" < 11`)
export class IntensityLogEntity extends BaseEntity implements IntensityLog {
  @Column({
    default: 5,
  })
  @IsNotEmpty()
  value: number;

  @OneToOne(() => SymptomEntity)
  @JoinColumn()
  @IsNotEmpty()
  symptom: Symptom;
}
