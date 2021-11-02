import { IsNotEmpty } from 'class-validator';
import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

import { SymptomLog } from '@interfaces/symptom-logs.interface';
import { IntensityLog } from '@interfaces/intensity-logs.interface';
import { User } from '@interfaces/users.interface';

import { IntensityLogEntity } from './intensity-logs.entity';
import { UserEntity } from './users.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'symptom_logs' })
export class SymptomLogEntity extends BaseEntity implements SymptomLog {
  @Column()
  @IsNotEmpty()
  date: Date;

  @ManyToMany(() => IntensityLogEntity)
  @JoinTable()
  intensityLogs: IntensityLog[];

  @ManyToOne(() => UserEntity, user => user.symptomLogs)
  user: User;
}
