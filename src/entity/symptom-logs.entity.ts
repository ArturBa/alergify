import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';

import { SymptomLog } from '../interfaces/symptom-logs.interface';
import { IntensityLog } from '../interfaces/intensity-logs.interface';
import { IntensityLogEntity } from './intensity-logs.entity';
import { UserEntity } from './users.entity';
import { User } from '../interfaces/users.interface';

@Entity()
export class SymptomLogEntity implements SymptomLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  date: Date;

  @ManyToMany(() => IntensityLogEntity)
  @JoinTable()
  intensityLogs: IntensityLog[];

  @ManyToOne(() => UserEntity, user => user.symptomLogs)
  user: User;
}
