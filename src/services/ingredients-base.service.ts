import { BaseFindParameters } from '@interfaces/internal/parameters.interface';
import { CreateIngredientDto } from '@dtos/ingredients.dto';
import { IngredientEntity } from '@entity/ingredients.entity';
import { IngredientGetRequest } from '@interfaces/ingredients.interface';

import { BaseFindParametersQueryBuilder } from './internal/base-find-params-builder';
import { BaseService } from './internal/base.service';

export class IngredientFindQueryBuilder extends BaseFindParametersQueryBuilder<IngredientEntity> {
  build(request: IngredientGetRequest): void {
    super.build(request);
    this.addName(request);
  }

  protected addUser({ userId }: BaseFindParameters): void {
    if (userId) {
      this.query = this.query.andWhere(
        `(userId IS :userId or userId IS NULL)`,
        { userId },
      );
    }
  }

  protected addName({ name }: IngredientGetRequest): void {
    if (name) {
      this.query = this.query.andWhere(`name LIKE :name`, {
        name: `%${name}%`,
      });
    }
  }
}

export class IngredientsServiceBase extends BaseService<IngredientEntity> {
  protected entity = IngredientEntity;

  create(params: CreateIngredientDto): Promise<IngredientEntity> {
    const entity = this.createDto(params);
    return this.getRepository().save(entity);
  }

  update(_: unknown): Promise<IngredientEntity> {
    throw new Error('Method not implemented.');
  }

  protected getQueryBuilder(): IngredientFindQueryBuilder {
    return new IngredientFindQueryBuilder(this.getRepository());
  }

  protected createDto(params: CreateIngredientDto): IngredientEntity {
    const entity = new IngredientEntity();
    entity.name = params.name;
    entity.userId = params.userId;
    return entity;
  }
}

export default IngredientsServiceBase;
