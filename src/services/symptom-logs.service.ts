import { FindManyOptions, getRepository } from 'typeorm';
import { User } from '@interfaces/users.interface';
import {
  SymptomLog,
  SymptomLogGetRequest,
} from '@interfaces/symptom-logs.interface';
import { SymptomLogEntity } from '@entity/symptom-logs.entity';
import {
  CreateSymptomLogDto,
  UpdateSymptomLogDto,
} from '@dtos/symptom-logs.dto';
import { UserEntity } from '@entity/users.entity';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';
import { PaginateResponse } from '@interfaces/internal/response.interface';
import { CreateIntensityLogDto } from '@dtos/intensity-logs.dto';
import { isEmpty } from '@utils/util';
import { checkIfConflict, checkIfEmpty } from './common.service';
import IntensityLogService from './intensity-logs.service';
import {
  afterDate,
  beforeDate,
  betweenDates,
  GetParamsBuilder,
} from './internal/get-params-builder';

class GetSymptomLogsParamsBuilder extends GetParamsBuilder<
  SymptomLogEntity,
  SymptomLogGetRequest
> {
  protected query: FindManyOptions<SymptomLogEntity> = {};

  constructor() {
    super();
    this.query = {
      ...this.query,
      select: ['id', 'date'],
      relations: ['intensityLogs'],
    };
  }

  build(request: SymptomLogGetRequest): void {
    this.addUserId(request);
    this.addPaginate(request);
    this.addDate(request);
  }

  get(): FindManyOptions<SymptomLogEntity> {
    return this.query;
  }

  protected addUserId({ userId }: SymptomLogGetRequest): void {
    this.appendWhere({ userId });
  }

  protected addPaginate({ start, limit }: SymptomLogGetRequest) {
    this.query = {
      ...this.query,
      skip: start,
      take: limit,
    };
  }

  protected addDate({ startDate, endDate }: SymptomLogGetRequest) {
    let date = null;
    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      date = betweenDates(startDate, endDate);
    } else if (isEmpty(startDate)) {
      date = afterDate(startDate);
    } else if (endDate) {
      date = beforeDate(endDate);
    } else {
      return;
    }
    this.appendWhere(date);
  }
}

class SymptomLogService {
  public symptomLogs = SymptomLogEntity;

  public intensityLogsService = new IntensityLogService();

  public async getAllSymptomLogs(
    request: SymptomLogGetRequest,
  ): Promise<PaginateResponse<Partial<SymptomLog>>> {
    const symptomLogRepository = getRepository(this.symptomLogs);
    const paramsBuilder = new GetSymptomLogsParamsBuilder();
    paramsBuilder.build(request);
    const symptoms: SymptomLog[] = await symptomLogRepository.find(
      paramsBuilder.get(),
    );

    const data = symptoms.map(symptom => {
      return {
        ...symptom,
        intensityLogs: symptom.intensityLogs.map(intensityLog => {
          const response = { ...intensityLog };
          delete response.createdAt;
          delete response.updatedAt;
          return response;
        }),
      };
    });

    const total = await symptomLogRepository.count({
      where: { userId: request.userId },
    });
    return { data, total };
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
    const user = await SymptomLogService.getUserById(userId);
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
          ? this.intensityLogsService.updateIntensityLog(intensityLog)
          : this.intensityLogsService.createIntensityLog(intensityLog);
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

  protected static async getUserById(userId: number): Promise<User> {
    const users = UserEntity;
    const userRepository = getRepository(users);
    const user = await userRepository.findOne({
      where: { id: userId },
    });
    checkIfConflict(!user);
    return user;
  }

  protected static async getIntensityLogsByIds(
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
