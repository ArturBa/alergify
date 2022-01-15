import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  BaseFindParameters,
  BaseGetParameters,
} from '@interfaces/internal/parameters.interface';
import { CreateFoodLogDto } from '@dtos/food-logs.dto';
import { FoodLogEntity } from '@entity/food-logs.entity';
import { FoodLogFindRequest } from '@interfaces/food-logs.interface';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

import { BaseService } from './internal/base.service';
import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';

class FoodLogsFindQueryBuilder extends BaseFindParametersQueryBuilder<FoodLogEntity> {
  constructor(repository: Repository<FoodLogEntity>) {
    super(repository);
    this.query = repository
      .createQueryBuilder('foodLog')
      .leftJoinAndSelect('foodLog.products', 'product')
      .leftJoinAndSelect('foodLog.ingredients', 'ingredient');
  }

  protected addUser({ userId }: BaseFindParameters): void {
    if (userId) {
      this.query.andWhere('foodLog.userId = :userId', { userId });
    }
  }

  protected addId({ id }: BaseGetParameters): void {
    if (id) {
      this.query.andWhere('foodLog.id = :id', { id });
    }
  }
}

export class FoodLogsServiceBase extends BaseService<FoodLogEntity> {
  protected entity = FoodLogEntity;

  protected getQuery(
    params: Partial<BaseGetParameters>,
  ): SelectQueryBuilder<FoodLogEntity> {
    const queryBuilder = new FoodLogsFindQueryBuilder(this.getRepository());
    queryBuilder.build(params);
    queryBuilder.select([
      'foodLog.id',
      'foodLog.userId',
      'foodLog.date',
      'product.id',
      'product.name',
      'product.barcode',
      'ingredient.id',
      'ingredient.name',
    ]);
    return queryBuilder.get();
  }

  find(params: FoodLogFindRequest): Promise<FoodLogEntity[]> {
    return this.getQuery(params).getMany();
  }

  count(params: BaseFindParameters): Promise<number> {
    const countParams = { ...params, start: null, limit: null };
    return this.getQuery(countParams).getCount();
  }

  async get(params: BaseGetParameters): Promise<FoodLogEntity> {
    const entity = await this.getQuery(params).getOne();
    if (!entity) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Not found');
    }
    return Promise.resolve(entity);
  }

  async create(foodLogDto: CreateFoodLogDto): Promise<FoodLogEntity> {
    const entity = await this.getCreateEntity(foodLogDto);
    return this.getRepository().save(entity);
  }

  async update(_: unknown): Promise<FoodLogEntity> {
    this.getRepository();
    throw new Error('Method not implemented.');
  }

  async remove(params: BaseGetParameters): Promise<FoodLogEntity> {
    const entity = await this.get(params);
    return this.getRepository().remove(entity);
    // 404
  }

  protected async getCreateEntity(
    entityDto: CreateFoodLogDto,
  ): Promise<FoodLogEntity> {
    console.log(this.entity);

    const entity = new FoodLogEntity();
    entity.userId = entityDto.userId;
    entity.date = new Date(entityDto.date);

    console.log('should check and add products');
    console.log('should check and add ingredients');

    return entity;
  }
}

export default FoodLogsServiceBase;
