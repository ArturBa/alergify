import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '@interfaces/users.interface';
import { FoodLog } from '@interfaces/food-logs.interface';
import { SymptomLog } from '@interfaces/symptom-logs.interface';

import { FoodLogEntity } from './food-logs.entity';
import { SymptomLogEntity } from './symptom-logs.entity';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['email'])
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  password: string;

  @OneToMany(() => FoodLogEntity, foodLog => foodLog.user)
  foodLogs: FoodLog[];

  @OneToMany(() => SymptomLogEntity, symptomLog => symptomLog.user)
  symptomLogs: SymptomLog[];
}
