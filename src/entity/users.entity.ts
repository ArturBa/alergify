/* eslint-disable import/prefer-default-export */
import { Entity, Column, Unique, OneToMany, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '@interfaces/users.interface';
import { FoodLog } from '@interfaces/food-logs.interface';
import { SymptomLog } from '@interfaces/symptom-logs.interface';

import { FoodLogEntity } from './food-logs.entity';
import { SymptomLogEntity } from './symptom-logs.entity';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'users',
})
@Unique(['email'])
export class UserEntity extends BaseEntity implements User {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({
    nullable: true,
  })
  username: string;

  @OneToMany(() => FoodLogEntity, foodLog => foodLog.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  foodLogs: FoodLog[];

  @OneToMany(() => SymptomLogEntity, symptomLog => symptomLog.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  symptomLogs: SymptomLog[];
}
