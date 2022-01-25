import { IntensityLogEntity } from '@entity/intensity-logs.entity';

import {
  CreateIntensityLogDto,
  UpdateIntensityLogDto,
} from '@dtos/intensity-logs.dto';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

import { BaseService } from './internal/base.service';
import { SymptomService } from './symptoms.service';

export class IntensityLogService extends BaseService<IntensityLogEntity> {
  entity = IntensityLogEntity;

  readonly symptomsService = new SymptomService();

  create(params: CreateIntensityLogDto): Promise<IntensityLogEntity> {
    const entity = this.createEntity(params);
    return this.getRepository().save(entity);
  }

  async update(params: UpdateIntensityLogDto): Promise<IntensityLogEntity> {
    const entity = await this.get({ id: params.id, userId: params.userId });
    this.modifyEntity(entity, params);
    return this.getRepository().save(entity);
  }

  /* eslint-disable no-param-reassign */
  protected modifyEntity(
    entity: IntensityLogEntity,
    params: CreateIntensityLogDto,
  ): IntensityLogEntity {
    entity.value = params.value;
    entity.symptomId = params.symptomId;
    try {
      this.symptomsService.get({ id: params.symptomId });
    } catch (error) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Symptom not found');
    }
    return entity;
  }
  /* eslint-enable no-param-reassign */

  protected createEntity(params: CreateIntensityLogDto): IntensityLogEntity {
    const entity = new IntensityLogEntity();
    entity.symptomLogId = params.symptomLogId;
    this.modifyEntity(entity, params);
    return entity;
  }
}

export default IntensityLogService;
