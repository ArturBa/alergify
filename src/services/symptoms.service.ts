import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entity/users.entity';
import { User } from '@interfaces/users.interface';
import { checkIfConflict, checkIfEmpty } from './common.service';
import { SymptomEntity } from '../entity/symptoms.entity';
import { Symptom } from '../interfaces/symptoms.interface';

class SymptomService {
  public symptoms = SymptomEntity;

  public async getAllSymptoms(): Promise<Partial<Symptom[]>> {
    const symptomRepository = getRepository(this.symptoms);
    const symptoms: Symptom[] = await symptomRepository.find({
      select: ['id', 'name'],
    });
    return symptoms;
  }

  public async findSymptomById(symptomId: number): Promise<Partial<Symptom>> {
    checkIfEmpty(symptomId);

    const symptomRepository = getRepository(this.symptoms);
    const symptom: Symptom = await symptomRepository.findOne({
      where: { id: symptomId },
      select: ['id', 'name'],
    });
    checkIfConflict(!symptomId);
    return symptom;
  }
}

export default SymptomService;
