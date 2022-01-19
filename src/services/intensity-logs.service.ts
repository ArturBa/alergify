import { IntensityLogEntity } from '@entity/intensity-logs.entity';
import {
  CreateIntensityLogDto,
  UpdateIntensityLogDto,
} from '@dtos/intensity-logs.dto';
import { BaseService } from './internal/base.service';

export class IntensityLogService extends BaseService<IntensityLogEntity> {
  entity = IntensityLogEntity;

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
    return entity;
  }
  /* eslint-enable no-param-reassign */

  protected createEntity(params: CreateIntensityLogDto): IntensityLogEntity {
    const entity = new IntensityLogEntity();
    this.modifyEntity(entity, params);
    return entity;
  }
}

export default IntensityLogService;
