import { IsNotEmpty } from 'class-validator';
import { Entity, Column, Unique } from 'typeorm';

import { Symptom } from '@interfaces/symptoms.interface';
import { BaseEntity } from './base.entity';

@Entity()
@Unique(['name'])
export class SymptomEntity extends BaseEntity implements Symptom {
  @Column()
  @IsNotEmpty()
  name: string;
}
