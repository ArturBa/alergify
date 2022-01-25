import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';

import { AllergensEntity } from '@entity/allergens.entity';
import { AllergenSetParameters } from '@interfaces/allergens.interface';
import { BaseFindParameters } from '@interfaces/internal/parameters.interface';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';
import { BaseService } from './internal/base.service';

class GetAllergensQueryBuilder extends BaseFindParametersQueryBuilder<AllergensEntity> {
  constructor(repository: Repository<AllergensEntity>) {
    super(repository);
    this.query = this.query.innerJoinAndSelect(
      `${this.getAliasPrefix()}ingredient`,
      'ingredient',
    );
  }

  build(params): void {
    super.build(params);
    this.addIngredientId(params);
    this.orderBy();
  }

  protected getAlias(): string {
    return 'allergens';
  }

  protected addIngredientId({ ingredientId }): void {
    if (ingredientId) {
      this.query.andWhere(
        `${this.getAliasPrefix()}ingredientId = :ingredientId`,
        { ingredientId },
      );
    }
  }

  protected orderBy(): void {
    this.query.orderBy('likelihood', 'DESC');
    // .orderBy(`${this.getAliasPrefix()}confirmed`, 'DESC')
    // .addOrderBy('likelihood', 'DESC');
  }
}

export class AllergensService extends BaseService<AllergensEntity> {
  entity = AllergensEntity;

  create(params: AllergenSetParameters): Promise<AllergensEntity> {
    const entity = this.createEntity(params);
    return this.getRepository().save(entity);
  }

  update(_: unknown): Promise<AllergensEntity> {
    throw new Error('Method not implemented.');
  }

  find(
    params: BaseFindParameters & { ingredientId?: number },
  ): Promise<AllergensEntity[]> {
    return super.find(params);
  }

  async set({
    ingredientId,
    userId,
  }: AllergenSetParameters): Promise<AllergensEntity> {
    const entity = await this.findEntity({ userId, ingredientId }, true);
    entity.confirmed = true;
    return this.getRepository().save(entity);
  }

  async unset({
    ingredientId,
    userId,
  }: AllergenSetParameters): Promise<AllergensEntity> {
    const entity = await this.findEntity({ userId, ingredientId });
    entity.confirmed = false;
    return this.getRepository().save(entity);
  }

  async addPoints(
    { userId, ingredientId }: AllergenSetParameters,
    points: number,
  ): Promise<UpdateResult> {
    await this.findEntity({ userId, ingredientId }, true);
    return this.getRepository().increment(
      { userId, ingredientId },
      'points',
      points,
    );
  }

  async subtractPoints(
    { userId, ingredientId }: AllergenSetParameters,
    points: number,
  ): Promise<UpdateResult> {
    await this.findEntity({ userId, ingredientId });
    return this.getRepository().decrement(
      { userId, ingredientId },
      'points',
      points,
    );
  }

  async increment({
    userId,
    ingredientId,
  }: AllergenSetParameters): Promise<UpdateResult> {
    await this.findEntity({ userId, ingredientId }, true);
    return this.getRepository().increment({ userId, ingredientId }, 'count', 1);
  }

  async decrement({
    userId,
    ingredientId,
  }: AllergenSetParameters): Promise<UpdateResult> {
    await this.findEntity({ userId, ingredientId });
    return this.getRepository().decrement({ userId, ingredientId }, 'count', 1);
  }

  protected getQueryBuilder(): BaseFindParametersQueryBuilder<AllergensEntity> {
    return new GetAllergensQueryBuilder(this.getRepository());
  }

  protected getQuery(
    params: BaseFindParameters,
  ): SelectQueryBuilder<AllergensEntity> {
    const query = this.getQueryBuilder();
    query.build(params);
    query.select([
      'allergens.id',
      'allergens.userId',
      'allergens.confirmed',
      'allergens.points',
      'allergens.count',
      'ingredient.id',
      'ingredient.name',
      'IIF(allergens.confirmed,24,allergens.points/allergens.count) AS likelihood',
    ]);
    return query.get();
  }

  protected createEntity(params: {
    userId: number;
    ingredientId: number;
  }): AllergensEntity {
    const entity = new AllergensEntity();
    entity.userId = params.userId;
    entity.ingredientId = params.ingredientId;
    return entity;
  }

  protected async findEntity(
    { userId, ingredientId }: AllergenSetParameters,
    create = false,
  ): Promise<AllergensEntity> {
    const entities = await this.find({ userId, ingredientId });
    if (entities.length > 0) {
      return entities[0];
    }
    if (create) {
      return this.create({ userId, ingredientId });
    }

    throw new HttpException(HttpStatusCode.NOT_FOUND, 'Allergen not found');
  }
}
