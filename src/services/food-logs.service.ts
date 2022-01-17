import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseGetParameters } from '@interfaces/internal/parameters.interface';
import { CreateFoodLogDto, UpdateFoodLogDto } from '@dtos/food-logs.dto';
import { FoodLogEntity } from '@entity/food-logs.entity';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { IngredientEntity } from '@entity/ingredients.entity';
import { ProductEntity } from '@entity/products.entity';

import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';
import { BaseService } from './internal/base.service';
import { IngredientsService } from './ingredients.service';
import { ProductsService } from './products.service';

class FoodLogsFindQueryBuilder extends BaseFindParametersQueryBuilder<FoodLogEntity> {
  constructor(repository: Repository<FoodLogEntity>) {
    super(repository);
    this.query = this.query
      .leftJoinAndSelect(`${this.getAliasPrefix()}products`, 'product')
      .leftJoinAndSelect(`${this.getAliasPrefix()}ingredients`, 'ingredient');
  }

  protected getAlias(): string {
    return 'foodLog';
  }
}

export class FoodLogsService extends BaseService<FoodLogEntity> {
  protected entity = FoodLogEntity;

  protected getQueryBuilder(): BaseFindParametersQueryBuilder<FoodLogEntity> {
    return new FoodLogsFindQueryBuilder(this.getRepository());
  }

  protected getQuery(
    params: Partial<BaseGetParameters>,
  ): SelectQueryBuilder<FoodLogEntity> {
    const queryBuilder = this.getQueryBuilder();
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

  async create(foodLogDto: CreateFoodLogDto): Promise<FoodLogEntity> {
    const entity = await this.createEntity(foodLogDto);
    return this.getRepository().save(entity);
  }

  async update(foodLogDto: UpdateFoodLogDto): Promise<FoodLogEntity> {
    const entity = await this.get({
      id: foodLogDto.id,
      userId: foodLogDto.userId,
    });
    this.updateEntity(entity, foodLogDto);
    return this.getRepository().save(entity);
  }

  protected async createEntity(
    entityDto: CreateFoodLogDto,
  ): Promise<FoodLogEntity> {
    const entity = new FoodLogEntity();
    return this.updateEntity(entity, entityDto);
  }

  /* eslint-disable no-param-reassign */
  protected async updateEntity(
    entity: FoodLogEntity,
    entityDto: CreateFoodLogDto,
  ): Promise<FoodLogEntity> {
    entity.date = new Date(entityDto.date);
    entity.products = await this.getProducts(
      entityDto.products,
      entityDto.userId,
    );
    entity.ingredients = await this.getIngredients(
      entityDto.ingredients,
      entityDto.userId,
    );
    return entity;
  }
  /* eslint-enable no-param-reassign */

  protected async getProducts(
    ids: number[],
    userId: number,
  ): Promise<ProductEntity[]> {
    try {
      const productsService = new ProductsService();
      return await Promise.all(
        ids.map(id => productsService.get({ id, userId })),
      );
    } catch {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Products not found');
    }
  }

  protected async getIngredients(
    ids: number[],
    userId: number,
  ): Promise<IngredientEntity[]> {
    try {
      const ingredientsService = new IngredientsService();
      return await Promise.all(
        ids.map(id => ingredientsService.get({ id, userId })),
      );
    } catch {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Ingredient not found');
    }
  }
}

export default FoodLogsService;
