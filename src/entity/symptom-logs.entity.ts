/* eslint-disable import/prefer-default-export */
import { IsNotEmpty } from 'class-validator';
import { Entity, Column, JoinTable, ManyToOne, OneToMany } from 'typeorm';

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

  @OneToMany(
    () => IntensityLogEntity,
    intensityLog => intensityLog.symptomLog,
    { cascade: true, onDelete: 'NO ACTION' },
  )
  intensityLogs: IntensityLog[];

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.symptomLogs, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'userId' })
  user: User;
}
