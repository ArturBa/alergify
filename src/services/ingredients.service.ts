import { getRepository } from 'typeorm';

import { CreateIngredientDto } from '@dtos/ingredients.dto';
import { IngredientEntity } from '@entity/ingredients.entity';
import {
  Ingredient,
  IngredientGetRequest,
} from '@interfaces/ingredients.interface';
import { PaginateResponse } from '@interfaces/internal/response.interface';

import { checkIfConflict, checkIfEmpty } from './common.service';
import GetQueryBuilder from './internal/get-params-builder';

class IngredientQueryBuilder extends GetQueryBuilder<
  IngredientEntity,
  IngredientGetRequest
> {
  constructor() {
    super();
    this.query = {
      select: ['id', 'name'],
    };
  }

  build(request: IngredientGetRequest): void {
    this.addName(request);
    this.addUser(request);
    this.addPagination(request);
  }

  protected addName({ name }: IngredientGetRequest): void {
    if (name) {
      this.appendWhere(` name Like '%${name}%' `);
    }
  }

  protected addUser({ userId }: IngredientGetRequest): void {
    if (userId) {
      this.appendWhere(`(userId IS ${userId} or userId IS NULL)`);
    }
  }

  protected addPagination({ start, limit }: IngredientGetRequest): void {
    this.query = {
      ...this.query,
      take: limit,
      skip: start,
    };
  }
}

class IngredientsService {
  public ingredients = IngredientEntity;

  public async findIngredients(
    req: IngredientGetRequest,
  ): Promise<PaginateResponse<Partial<Ingredient>>> {
    checkIfEmpty(req);

    const ingredientsRepository = getRepository(this.ingredients);
    const queryBuilder = new IngredientQueryBuilder();
    queryBuilder.build(req);
    const data = await ingredientsRepository.find(queryBuilder.get());
    const total = await ingredientsRepository.count(queryBuilder.getTotal());

    return { data, total };
  }

  public async getIngredientById(
    ingredientId: number,
  ): Promise<Partial<Ingredient>> {
    checkIfEmpty(ingredientId);

    const ingredientsRepository = getRepository(this.ingredients);
    const ingredient = await ingredientsRepository.findOne({
      where: { id: ingredientId },
      select: ['id', 'name'],
    });
    checkIfConflict(!ingredient);

    return ingredient;
  }

  public async createIngredient(
    userId: number,
    ingredientData: CreateIngredientDto,
  ): Promise<void> {
    checkIfEmpty(ingredientData);

    const ingredientsRepository = getRepository(this.ingredients);

    const ingredient = new IngredientEntity();
    ingredient.name = ingredientData.name;
    ingredient.userId = userId;

    await ingredientsRepository.save(ingredient);
  }
}

export default IngredientsService;
