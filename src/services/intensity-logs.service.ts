import { getRepository } from 'typeorm';
import { checkIfConflict, checkIfEmpty } from './common.service';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';
import { CreateIntensityLogDto } from '@dtos/intensity-logs.dto';
import { SymptomEntity } from '@entity/symptoms.entity';
import { Symptom } from '@interfaces/symptoms.interface';

class IntensityLogService {
  intensityLog = IntensityLogEntity;

  public async createIntensityLog(
    intensityData: CreateIntensityLogDto,
    userId: number,
  ): Promise<void> {
    checkIfEmpty(intensityData);
    checkIfEmpty(userId);
    const intensity = new IntensityLogEntity();
    const symptom = await this.getSymptomById(intensityData.symptomId);
    checkIfConflict(!symptom);
    intensity.symptom = symptom;
    intensity.value = intensityData.value;
    const intensityLogRepository = getRepository(this.intensityLog);
    await intensityLogRepository.save(intensity);
  }

  public async updateIntensityLog(
    intensityData: Partial<CreateIntensityLogDto> & { id: number },
  ): Promise<void> {
    checkIfEmpty(intensityData);
    checkIfEmpty(intensityData.id);
    const intensityLogRepository = getRepository(this.intensityLog);
    const intensity = await intensityLogRepository.findOne(intensityData.id);
    checkIfConflict(!intensity);
    if (intensityData.symptomId) {
      const symptom = await this.getSymptomById(intensityData.symptomId);
      intensity.symptom = symptom;
    }
    if (intensityData.value) {
      intensity.value = intensityData.value;
    }
    intensityLogRepository.update(intensity.id, intensity);
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
