import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseFindParameters } from '@interfaces/internal/parameters.interface';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { ProductCreateDto } from '@dtos/products.dto';
import { ProductEntity } from '@entity/products.entity';
import { ProductFindRequest } from '@interfaces/products.interface';

import { BaseService } from './internal/base.service';
import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';
import { IngredientsService } from './ingredients.service';

export class ProductsFindQueryBuilder extends BaseFindParametersQueryBuilder<ProductEntity> {
  constructor(repository: Repository<ProductEntity>) {
    super(repository);
    this.query = this.query.leftJoinAndSelect(
      `${this.getAliasPrefix()}ingredients`,
      'ingredients',
    );
  }

  build(request: ProductFindRequest): void {
    super.build(request);
    this.addName(request);
    this.addBarcode(request);
  }

  protected getAlias(): string {
    return 'product';
  }

  protected addUser({ userId }: ProductFindRequest): void {
    if (userId) {
      this.query = this.query.andWhere(
        `(${this.getAliasPrefix()}userId IS :userId ` +
          ` OR ${this.getAliasPrefix()}userId IS NULL)`,
        { userId },
      );
    }
  }

  protected addName({ name }: ProductFindRequest): void {
    if (name) {
      this.query = this.query.andWhere(
        `${this.getAliasPrefix()}name LIKE :name`,
        {
          name: `%${name}%`,
        },
      );
    }
  }

  protected addBarcode({ barcode }: ProductFindRequest): void {
    if (barcode) {
      this.query = this.query.andWhere(
        `${this.getAliasPrefix()}barcode = :barcode`,
        {
          barcode,
        },
      );
    }
  }
}

export class ProductsService extends BaseService<ProductEntity> {
  entity = ProductEntity;

  readonly ingredientService = new IngredientsService();

  async create(params: ProductCreateDto): Promise<ProductEntity> {
    const entity = await this.createDto(params);
    return this.getRepository().save(entity);
  }

  update(_: unknown): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }

  protected getQueryBuilder(): BaseFindParametersQueryBuilder<ProductEntity> {
    return new ProductsFindQueryBuilder(this.getRepository());
  }

  protected getQuery(
    params: BaseFindParameters,
  ): SelectQueryBuilder<ProductEntity> {
    const queryBuilder = this.getQueryBuilder();
    queryBuilder.build(params);
    queryBuilder.select([
      'product.id',
      'product.name',
      'product.barcode',
      'product.userId',
      'ingredients.id',
      'ingredients.name',
    ]);
    return queryBuilder.get();
  }

  protected async createDto(params: ProductCreateDto): Promise<ProductEntity> {
    const entity = new ProductEntity();
    entity.name = params.name;
    entity.userId = params.userId;
    entity.barcode = params.barcode;
    try {
      entity.ingredients = await Promise.all(
        params.ingredients.map(id =>
          this.ingredientService.get({ id, userId: params.userId }),
        ),
      );
    } catch {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Invalid ingredient');
    }
    return entity;
  }
}
