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
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

import { BaseFindParametersQueryBuilder } from './base-find-params-builder';

export abstract class BaseService<Entity extends BaseEntity> {
  abstract entity: EntityTarget<Entity>;

  abstract create(params: unknown): Promise<Entity>;
  abstract update(params: unknown): Promise<Entity>;

  find(params: BaseFindParameters): Promise<Entity[]> {
    return this.getQuery(params).getMany();
  }

  count(params: BaseFindParameters): Promise<number> {
    const countParams = { ...params, start: null, limit: null };
    return this.getQuery(countParams).getCount();
  }

  async get(params: BaseGetParameters): Promise<Entity> {
    const entity = await this.getQuery(params).getOne();
    if (!entity) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Not found');
    }
    return Promise.resolve(entity);
  }

  async remove(params: BaseGetParameters): Promise<Entity> {
    const entity = await this.get(params);
    return this.getRepository().remove(entity);
  }

  protected getRepository(): Repository<Entity> {
    return getRepository(this.entity);
  }

  protected getQueryBuilder(): BaseFindParametersQueryBuilder<Entity> {
    return new BaseFindParametersQueryBuilder(this.getRepository());
  }

  protected getQuery(params: BaseFindParameters): SelectQueryBuilder<Entity> {
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.build(params);
    return queryBuilder.get();
  }
}

export default BaseService;
