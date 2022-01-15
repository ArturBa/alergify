import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { AllergensEntity } from '@entity/allergens.entity';
import { GetAllergensRequest } from '@interfaces/allergens.interface';
import { IngredientEntity } from '@entity/ingredients.entity';
import { isEmpty } from '@utils/util';
import { PaginateResponse } from '@interfaces/internal/response.interface';

import { checkIfConflict } from './common.service';

class GetAllergensQueryBuilder {
  protected query: SelectQueryBuilder<AllergensEntity>;

  protected limit: number;

  protected start: number;

  constructor(repository: Repository<AllergensEntity>) {
    this.query = repository
      .createQueryBuilder('allergens')
      .innerJoinAndSelect('allergens.ingredient', 'ingredient');
  }

  build(request: GetAllergensRequest): void {
    this.addUser(request);
    this.savePagination(request);
    this.addSelect();
  }

  get(): SelectQueryBuilder<AllergensEntity> {
    return this.query.take(this.limit).skip(this.start);
  }

  getTotal(): SelectQueryBuilder<AllergensEntity> {
    return this.query;
  }

  protected addUser({ userId }: GetAllergensRequest): void {
    if (isEmpty(userId)) return;
    this.query = this.query.andWhere('allergens.userId = :userId', { userId });
  }

  protected savePagination({ limit, start }: GetAllergensRequest): void {
    this.limit = limit;
    this.start = start;
  }

  protected addSelect(): void {
    this.query.select([
      'ingredient.id',
      'ingredient.name',
      'allergens.id',
      'allergens.points',
      'allergens.confirmed',
    ]);
  }
}

class AllergensService {
  readonly allergens = AllergensEntity;

  readonly ingredients = IngredientEntity;

  public async getAllergens(
    req: GetAllergensRequest,
  ): Promise<PaginateResponse<any>> {
    const allergensRepository = await getRepository(this.allergens);
    const queryBuilder = new GetAllergensQueryBuilder(allergensRepository);
    queryBuilder.build(req);
    const data = (await queryBuilder.get().getMany())
      .map(allergen => ({
        ...allergen,
        likelihood: allergen.points,
      }))
      .map(allergen => {
        const allergenCopy = allergen;
        delete allergenCopy.points;
        delete allergenCopy.id;
        return allergenCopy;
      });
    const total = await queryBuilder.getTotal().getCount();
    return { total, data };
  }

  public async setAllergen(
    userId: number,
    ingredientId: number,
  ): Promise<void> {
    const allergensRepository = getRepository(this.allergens);
    const ingredientRepository = getRepository(this.ingredients);

    const ingredient = await ingredientRepository.findOne({ id: ingredientId });
    checkIfConflict(
      ingredient.userId !== userId && ingredient.userId !== null,
      'Ingredient does not exist',
    );

    const allergenFromDb = await allergensRepository.findOne({
      where: { userId, ingredientId },
    });

    const newAllergen = new AllergensEntity();
    newAllergen.userId = userId;
    newAllergen.ingredientId = ingredientId;

    const allergen = allergenFromDb || newAllergen;
    allergen.confirmed = true;

    await allergensRepository.save(allergen);
  }

  public async removeAllergen(
    userId: number,
    ingredientId: number,
  ): Promise<void> {
    const allergensRepository = getRepository(this.allergens);
    const allergenFromDb = await allergensRepository.findOne({
      where: { userId, ingredientId },
    });
    checkIfConflict(!allergenFromDb, 'Allergen does not exist');

    await allergensRepository.delete({
      userId,
      ingredientId,
    });
  }

  public async decrementAllergen(
    userId: number,
    ingredientId: number,
    points: number,
  ): Promise<void> {
    const allergensRepository = getRepository(this.allergens);
    await allergensRepository.increment(
      { userId, ingredientId },
      'points',
      -points,
    );
  }

  public async incrementAllergen(
    userId: number,
    ingredientId: number,
    points: number,
  ): Promise<void> {
    const allergensRepository = getRepository(this.allergens);
    await allergensRepository.increment(
      { userId, ingredientId },
      'points',
      points,
    );
  }
}

export default AllergensService;
