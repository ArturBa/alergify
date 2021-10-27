import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from '@interfaces/users.interface';
import { FoodLog } from '@interfaces/food-logs.interface';
import { FoodLogEntity } from './food-logs.entity';
import { SymptomLogEntity } from './symptom-logs.entity';
import { SymptomLog } from '../interfaces/symptom-logs.interface';

@Entity()
@Unique(['email'])
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FoodLogEntity, foodLog => foodLog.user)
  foodLogs: FoodLog[];

  @OneToMany(() => SymptomLogEntity, symptomLog => symptomLog.user)
  symptomLogs: SymptomLog[];
}
