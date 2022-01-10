import { getRepository } from 'typeorm';

import { AllergensEntity } from '@entity/allergens.entity';
import { GetAllergensRequest } from '@interfaces/allergens.interface';
import { IngredientEntity } from '@entity/ingredients.entity';

import { checkIfConflict } from './common.service';

class AllergensService {
  readonly allergens = AllergensEntity;

  readonly ingredients = IngredientEntity;

  public async getAllergens(
    userId: number,
    req: GetAllergensRequest,
  ): Promise<any> {
    const allergensRepository = await getRepository(this.allergens);
    const data = await allergensRepository.find({
      // select: ['likelihood', 'confirmed'],
      where: { userId },
      relations: ['ingredient'],
      take: req.limit,
      skip: req.start,
    });
    const total = await allergensRepository.count({
      where: { userId },
    });
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

    const allergen = allergenFromDb || new AllergensEntity();
    allergen.userId = userId;
    allergen.ingredientId = ingredientId;
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
    console.log(allergenFromDb);
    checkIfConflict(!allergenFromDb, 'Allergen does not exist');

    await allergensRepository.delete({
      userId,
      ingredientId,
    });
  }
}

export default AllergensService;
