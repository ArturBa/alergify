import { getRepository } from 'typeorm';
import { checkIfConflict, checkIfEmpty } from './common.service';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';
import {
  CreateIntensityLogDto,
  UpdateIntensityLogDto,
} from '@dtos/intensity-logs.dto';
import { SymptomEntity } from '@entity/symptoms.entity';
import { Symptom } from '@interfaces/symptoms.interface';

class IntensityLogService {
  intensityLog = IntensityLogEntity;

  public async createIntensityLog(
    intensityData: CreateIntensityLogDto,
  ): Promise<IntensityLogEntity> {
    checkIfEmpty(intensityData);
    const intensity = new IntensityLogEntity();
    const symptom = await this.getSymptomById(intensityData.symptom);
    checkIfConflict(!symptom);
    console.log(symptom);
    intensity.symptom = symptom;
    intensity.value = intensityData.value;
    console.log(intensityData);
    const intensityLogRepository = getRepository(this.intensityLog);
    await intensityLogRepository.save(intensity);
    return intensity;
  }

  public async updateIntensityLog(
    intensityData: UpdateIntensityLogDto,
  ): Promise<IntensityLogEntity> {
    checkIfEmpty(intensityData);
    checkIfEmpty(intensityData.id);
    const intensityLogRepository = getRepository(this.intensityLog);
    const intensity = await intensityLogRepository.findOne(intensityData.id);
    checkIfConflict(!intensity);
    const symptom = await this.getSymptomById(intensityData.symptom);
    intensity.symptom = symptom;
    intensity.value = intensityData.value;
    intensityLogRepository.save(intensity);
    return intensity;
  }

  public async deleteIntensityLog(intensityId: number): Promise<void> {
    checkIfEmpty(intensityId);
    const intensityLogRepository = getRepository(this.intensityLog);
    intensityLogRepository.delete(intensityId);
  }

  protected getSymptomById(id: number): Promise<Symptom> {
    return getRepository(SymptomEntity).findOne(id);
  }
}

export default IntensityLogService;
