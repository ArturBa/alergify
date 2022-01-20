import { Repository, SelectQueryBuilder } from 'typeorm';

import { SymptomLogEntity } from '@entity/symptom-logs.entity';

import { BaseFindParameters } from '@interfaces/internal/parameters.interface';
import { CreateIntensityLogDto } from '@dtos/intensity-logs.dto';
import {
  CreateSymptomLogDto,
  UpdateSymptomLogDto,
} from '@dtos/symptom-logs.dto';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { IntensityLog } from '@interfaces/intensity-logs.interface';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';

import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';
import { BaseService } from './internal/base.service';
import { IntensityLogService } from './intensity-logs.service';

export class SymptomLogFindQueryBuilder extends BaseFindParametersQueryBuilder<SymptomLogEntity> {
  constructor(repository: Repository<SymptomLogEntity>) {
    super(repository);
    this.query = this.query.leftJoinAndSelect(
      `${this.getAliasPrefix()}symptoms`,
      'intensityLogs',
    );
  }

  protected getAlias(): string {
    return 'symptomLog';
  }
}

export class SymptomLogsService extends BaseService<SymptomLogEntity> {
  entity = SymptomLogEntity;

  readonly intensityLogService = new IntensityLogService();

  async create(params: CreateSymptomLogDto): Promise<SymptomLogEntity> {
    const entity = await this.createEntity(params);
    return this.getRepository().save(entity);
  }

  async update(params: UpdateSymptomLogDto): Promise<SymptomLogEntity> {
    const entity = await this.get({ id: params.id, userId: params.userId });
    this.updateEntity(entity, params);
    return this.getRepository().save(entity);
  }

  protected getQuery(
    params: Partial<BaseFindParameters>,
  ): SelectQueryBuilder<SymptomLogEntity> {
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.build(params);
    queryBuilder.select([
      'symptomLog.id',
      'symptomLog.userId',
      'symptomLog.date',
      'intensityLogs.symptomId',
      'intensityLogs.intensity',
      'intensityLogs.name',
    ]);
    return queryBuilder.get();
  }

  protected getQueryBuilder(): BaseFindParametersQueryBuilder<SymptomLogEntity> {
    return new SymptomLogFindQueryBuilder(this.getRepository());
  }

  protected async createEntity(
    params: CreateSymptomLogDto,
  ): Promise<SymptomLogEntity> {
    const entity = new SymptomLogEntity();
    entity.date = new Date(params.date);
    entity.intensityLogs = await this.createIntensityLog(params.intensityLogs);
    entity.userId = params.userId;
    return entity;
  }

  /* eslint-disable no-param-reassign */
  protected async updateEntity(
    entity: SymptomLogEntity,
    params: UpdateSymptomLogDto,
  ): Promise<SymptomLogEntity> {
    entity.date = new Date(params.date);
    if (!this.areAllIntensityLogsInSymptomLog(entity.intensityLogs, entity)) {
      throw new HttpException(
        HttpStatusCode.NOT_MODIFIED,
        'Some intensity logs are non valid',
      );
    }
    entity.intensityLogs = await this.updateIntensityLog(
      entity.intensityLogs as IntensityLogEntity[],
      params.intensityLogs,
    );
    entity.date = new Date(params.date);
    return entity;
  }
  /* eslint-enable no-param-reassign */

  protected createIntensityLog(
    params: CreateIntensityLogDto[],
  ): Promise<IntensityLogEntity[]> {
    return Promise.all(
      params.map(intensityDto => this.intensityLogService.create(intensityDto)),
    );
  }

  protected areAllIntensityLogsInSymptomLog(
    intensityLogs: IntensityLog[],
    symptomLog: SymptomLogEntity,
  ): boolean {
    return intensityLogs.every(
      intensityLog => intensityLog.symptomLogId === symptomLog.id,
    );
  }

  protected async updateIntensityLog(
    intensityLogs: IntensityLogEntity[],
    params: CreateIntensityLogDto[],
  ): Promise<IntensityLogEntity[]> {
    await Promise.all(
      intensityLogs.map(async intensityLog => {
        this.intensityLogService.remove({ id: intensityLog.id });
      }),
    );

    return this.createIntensityLog(params);
  }
}
