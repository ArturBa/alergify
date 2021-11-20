import { IsNotEmpty } from 'class-validator';
import { Entity, Column, JoinColumn, Check, ManyToOne } from 'typeorm';

import { Symptom } from '@interfaces/symptoms.interface';
import { IntensityLog } from '@interfaces/intensity-logs.interface';

import { SymptomEntity } from './symptoms.entity';
import { BaseEntity } from './base.entity';
import { SymptomLogEntity } from './symptom-logs.entity';

@Entity({ name: 'intensity_logs' })
@Check(`"value" > 0 AND "value" < 11`)
export class IntensityLogEntity extends BaseEntity implements IntensityLog {
  @Column({
    default: 5,
    type: 'integer',
  })
  @IsNotEmpty()
  value: number;

  @ManyToOne(() => SymptomLogEntity, {
    onDelete: 'CASCADE',
  })
  symptomLog: SymptomLogEntity;

  @Column()
  symptomId: number;

  @ManyToOne(() => SymptomEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'symptomId' })
  @IsNotEmpty()
  symptom: Symptom;
}
