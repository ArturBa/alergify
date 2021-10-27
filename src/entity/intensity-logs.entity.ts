import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Symptom } from '@interfaces/symptoms.interface';
import { IntensityLog } from '@interfaces/intensity-logs.interface';
import { SymptomEntity } from './symptoms.entity';

@Entity()
export class IntensityLogEntity implements IntensityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  value = 0;

  @OneToOne(() => SymptomEntity)
  @JoinColumn()
  @IsNotEmpty()
  symptom: Symptom;
}
