import {
  getRepository,
  Repository,
  EntityTarget,
  SelectQueryBuilder,
} from 'typeorm';

import { BaseEntity } from '@entity/base.entity';
import {
  BaseFindParameters,
  BaseGetParameters,
} from '@interfaces/internal/parameters.interface';

export abstract class BaseService<Entity extends BaseEntity> {
  protected abstract entity: EntityTarget<Entity>;

  protected getRepository(): Repository<Entity> {
    return getRepository(this.entity);
  }

  protected abstract getQuery(
    _: BaseFindParameters,
  ): SelectQueryBuilder<Entity>;

  abstract find(_: BaseFindParameters): Promise<Entity[]>;
  abstract count(_: BaseFindParameters): Promise<number>;
  abstract get(_: BaseGetParameters): Promise<Entity>;
  abstract create(_: unknown): Promise<Entity>;
  abstract update(_: unknown): Promise<Entity>;
  abstract remove(_: BaseGetParameters): Promise<Entity>;
}

export default BaseService;
