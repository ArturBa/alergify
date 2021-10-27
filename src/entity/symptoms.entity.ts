import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

import { Symptom } from '../interfaces/symptoms.interface';

@Entity()
@Unique(['name'])
export class SymptomEntity implements Symptom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;
}
