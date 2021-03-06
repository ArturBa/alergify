import { Repository, SelectQueryBuilder } from 'typeorm';

import { SymptomLogEntity } from '@entity/symptom-logs.entity';

import { BaseFindParameters } from '@interfaces/internal/parameters.interface';
import { CreateIntensityLogDto } from '@dtos/intensity-logs.dto';
import {
  CreateSymptomLogDto,
  UpdateSymptomLogDto,
} from '@dtos/symptom-logs.dto';
import { IntensityLog } from '@interfaces/intensity-logs.interface';
import { IntensityLogEntity } from '@entity/intensity-logs.entity';

import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';
import { BaseService } from './internal/base.service';
import { IntensityLogService } from './intensity-logs.service';

export class SymptomLogFindQueryBuilder extends BaseFindParametersQueryBuilder<SymptomLogEntity> {
  constructor(repository: Repository<SymptomLogEntity>) {
    super(repository);
    this.query = this.query.leftJoinAndSelect(
      `${this.getAliasPrefix()}intensityLogs`,
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
    const symptom = await this.getRepository().save(entity);
    const intensityLogsParams = params.intensityLogs.map(intensityLog => {
      return {
        ...intensityLog,
        symptomLogId: symptom.id,
      };
    });
    await this.createIntensityLog(intensityLogsParams);

    return this.getRepository().findOne(symptom.id);
  }

  async update(params: UpdateSymptomLogDto): Promise<SymptomLogEntity> {
    const entity = await this.get({ id: params.id, userId: params.userId });
    const intensityLogsParams = params.intensityLogs.map(intensityLog => {
      return {
        ...intensityLog,
        symptomLogId: entity.id,
      };
    });
    this.updateEntity(entity, {
      ...params,
      intensityLogs: intensityLogsParams,
    });
    return this.getRepository().save(entity);
  }

  protected getQuery(
    params: Partial<BaseFindParameters>,
  ): SelectQueryBuilder<SymptomLogEntity> {
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.build(params, { orderByDate: true });
    queryBuilder.select([
      'symptomLog.id',
      'symptomLog.userId',
      'symptomLog.date',
      'intensityLogs.id',
      'intensityLogs.symptomId',
      'intensityLogs.value',
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
    entity.userId = params.userId;
    return entity;
  }

  /* eslint-disable no-param-reassign */
  protected async updateEntity(
    entity: SymptomLogEntity,
    params: UpdateSymptomLogDto,
  ): Promise<SymptomLogEntity> {
    entity.date = new Date(params.date);
    entity.intensityLogs = await this.updateIntensityLog(
      entity.intensityLogs as IntensityLogEntity[],
      params.intensityLogs,
    );
    entity.date = new Date(params.date);
    return entity;
  }
  /* eslint-enable no-param-reassign */

  protected async createIntensityLog(
    params: CreateIntensityLogDto[],
  ): Promise<IntensityLogEntity[]> {
    const intensityLogEntities = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const intensityLog of params) {
      intensityLogEntities.push(
        // eslint-disable-next-line no-await-in-loop
        await this.intensityLogService.create(intensityLog),
      );
    }
    return Promise.resolve(intensityLogEntities);
  }

  protected async updateIntensityLog(
    intensityLogs: IntensityLogEntity[],
    params: CreateIntensityLogDto[],
  ): Promise<IntensityLogEntity[]> {
    // eslint-disable-next-line no-restricted-syntax
    for (const intensityLog of intensityLogs) {
      // eslint-disable-next-line no-await-in-loop
      await this.intensityLogService.remove({ id: intensityLog.id });
    }

    return this.createIntensityLog(params);
  }
}
