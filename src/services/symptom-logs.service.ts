import { getRepository } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { checkIfConflict, checkIfEmpty } from './common.service';
import { SymptomLog } from '@interfaces/symptom-logs.interface';
import { SymptomLogEntity } from '@entity/symptom-logs.entity';
import {
  CreateSymptomLogDto,
  UpdateSymptomLogDto,
} from '@dtos/symptom-logs.dto';
import { UserEntity } from '@entity/users.entity';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';
import { Paginate } from '../interfaces/internal/paginate.interface';
import { SymptomEntity } from '../entity/symptoms.entity';
import { CreateIntensityLogDto } from '../dtos/intensity-logs.dto';
import IntensityLogService from './intensity-logs.service';

class SymptomLogService {
  public symptomLogs = SymptomLogEntity;
  public intensityLogsService = new IntensityLogService();

  public async getAllSymptomLogs(
    userId: number,
  ): Promise<Paginate<Partial<SymptomLog>>> {
    const symptomLogRepository = getRepository(this.symptomLogs);
    const symptoms: SymptomLog[] = await symptomLogRepository.find({
      select: ['id', 'date'],
      where: { userId },
      relations: ['intensityLogs'],
    });
    const data = symptoms.map(symptom => {
      symptom.intensityLogs.forEach(intensityLog => {
        delete intensityLog.createdAt;
        delete intensityLog.updatedAt;
      });
    });

    const total = await symptomLogRepository.count({ where: { userId } });
    return { data: symptoms, total };
  }

  public async findSymptomLogById(
    symptomLogId: number,
    userId: number,
  ): Promise<Partial<SymptomLog>> {
    checkIfEmpty(symptomLogId);
    checkIfEmpty(userId);

    const symptomLogRepository = getRepository(this.symptomLogs);
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
    const intensityLogs = await this.createIntensityLogs(
      symptomData.intensityLogs,
    );
    symptom.intensityLogs = intensityLogs;
    const user = await this.getUserById(userId);
    symptom.user = user;

    const symptomLogRepository = getRepository(this.symptomLogs);
    await symptomLogRepository.save(symptom);
  }

  public async updateSymptom(
    symptomData: UpdateSymptomLogDto,
    userId: number,
  ): Promise<void> {
    checkIfEmpty(symptomData);
    checkIfEmpty(userId);

    const symptomLogRepository = getRepository(this.symptomLogs);
    const symptomLog: SymptomLog = await symptomLogRepository.findOne({
      where: { id: symptomData.id, userId },
      relations: ['intensityLogs'],
    });
    checkIfConflict(!symptomLog);

    // TODO: remove unused intensity logs
    const intensityLogs = await Promise.all(
      symptomData.intensityLogs.map(async intensityLog => {
        return intensityLog.id
          ? await this.intensityLogsService.updateIntensityLog(intensityLog)
          : await this.intensityLogsService.createIntensityLog(intensityLog);
      }),
    );
    symptomLog.intensityLogs = intensityLogs;
    symptomLog.date = new Date(symptomData.date);
    await symptomLogRepository.save(symptomLog);
  }

  public async deleteSymptomLog(
    symptomLogId: number,
    userId: number,
  ): Promise<void> {
    checkIfEmpty(symptomLogId);
    checkIfEmpty(userId);

    const symptomLogRepository = getRepository(this.symptomLogs);
    const symptomLog: SymptomLog = await symptomLogRepository.findOne({
      where: { userId, id: symptomLogId },
    });
    checkIfConflict(!symptomLog);
    await symptomLogRepository.delete({ id: symptomLogId, userId });
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

  protected async createIntensityLogs(
    intensityLogs: CreateIntensityLogDto[],
  ): Promise<IntensityLogEntity[]> {
    return Promise.all(
      intensityLogs.map(async intensityLog => {
        return this.intensityLogsService.createIntensityLog(intensityLog);
      }),
    );
  }
}

export default SymptomLogService;
