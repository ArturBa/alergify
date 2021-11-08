import { getRepository } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { checkIfConflict, checkIfEmpty } from './common.service';
import { SymptomLog } from '@interfaces/symptom-logs.interface';
import { SymptomLogEntity } from '@entity/symptom-logs.entity';
import { CreateSymptomLogDto } from '@dtos/symptom-logs.dto';
import { UserEntity } from '@entity/users.entity';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';

class SymptomLogService {
  public symptoms = SymptomLogEntity;

  public async getAllSymptomLogs(
    userId: number,
  ): Promise<Partial<SymptomLog[]>> {
    const symptomLogRepository = getRepository(this.symptoms);
    const symptoms: SymptomLog[] = await symptomLogRepository.find({
      select: ['id', 'intensityLogs', 'date'],
      where: { userId },
    });
    return symptoms;
  }

  public async findSymptomLogById(
    symptomLogId: number,
    userId: number,
  ): Promise<Partial<SymptomLog>> {
    checkIfEmpty(symptomLogId);
    checkIfEmpty(userId);

    const symptomLogRepository = getRepository(this.symptoms);
    const symptomLog: SymptomLog = await symptomLogRepository.findOne({
      select: ['id', 'intensityLogs', 'date'],
      where: { userId, id: symptomLogId },
    });
    checkIfConflict(!symptomLog);
    return symptomLog;
  }

  public async createSymptom(
    symptomData: CreateSymptomLogDto,
    userId: number,
  ): Promise<void> {
    checkIfEmpty(symptomData);
    checkIfEmpty(symptomData.intensityLogs);
    checkIfEmpty(userId);

    const symptom = new SymptomLogEntity();
    symptom.date = new Date(symptomData.date);
    const intensityLogs = await this.getIntensityLogsByIds(
      symptomData.intensityLogs,
    );
    symptom.intensityLogs = intensityLogs;
    const user = await this.getUserById(userId);
    symptom.user = user;

    const symptomLogRepository = getRepository(this.symptoms);
    await symptomLogRepository.save(symptom);
  }

  public async updateSymptom(
    symptomData: Partial<CreateSymptomLogDto> & { id: number },
    userId: number,
  ): Promise<void> {
    checkIfEmpty(symptomData);
    checkIfEmpty(userId);
    checkIfEmpty(symptomData.id);

    const symptomLogRepository = getRepository(this.symptoms);
    const symptomLog: SymptomLog = await symptomLogRepository.findOne({
      where: { id: symptomData.id },
    });
    checkIfConflict(!symptomLog);
    checkIfConflict(symptomLog.user.id !== userId, 'User id does not match');

    if (symptomData.date) {
      symptomLog.date = new Date(symptomData.date);
    }
    if (symptomData.intensityLogs) {
      const intensityLogs = await this.getIntensityLogsByIds(
        symptomData.intensityLogs,
      );
      symptomLog.intensityLogs = intensityLogs;
    }
    await symptomLogRepository.update(symptomData.id, { ...symptomLog });
  }

  public async deleteSymptomLog(
    symptomLogId: number,
    userId: number,
  ): Promise<void> {
    checkIfEmpty(symptomLogId);
    checkIfEmpty(userId);

    const symptomLogRepository = getRepository(this.symptoms);
    const symptomLog: SymptomLog = await symptomLogRepository.findOne({
      where: { userId, id: symptomLogId },
    });
    checkIfConflict(!symptomLog);
    await symptomLogRepository.delete(symptomLogId);
  }

  protected async getUserById(userId: number): Promise<User> {
    const users = UserEntity;
    const userRepository = getRepository(users);
    const user = await userRepository.findOne({
      where: { id: userId },
    });
    checkIfConflict(!user);
    return user;
  }

  protected async getIntensityLogsByIds(
    ingredientIds: number[],
  ): Promise<IntensityLogEntity[]> {
    const intensityLog = IntensityLogEntity;
    const intensityLogRepository = getRepository(intensityLog);
    const intensityLogs = await intensityLogRepository.findByIds(ingredientIds);
    checkIfConflict(!intensityLogs);
    return intensityLogs;
  }
}

export default SymptomLogService;
