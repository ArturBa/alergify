import { getRepository } from 'typeorm';
import { IngredientEntity } from '@entity/ingredients.entity';
import { checkIfConflict, checkIfEmpty } from './common.services';
import { Ingredient } from '@interfaces/ingredients.interface';
import { CreateIngredientDto } from '@dtos/ingredients.dto';

class IngredientsService {
  public ingredients = IngredientEntity;

  public async findIngredientByQuery(query: string): Promise<Ingredient[]> {
    checkIfEmpty(query);

    const ingredientsRepository = getRepository(this.ingredients);
    const ingredients = await ingredientsRepository.find({
      where: { name: query },
    });

    return ingredients;
  }

  public async getIngredientById(
    ingredientId: number,
  ): Promise<Partial<Ingredient>> {
    checkIfEmpty(ingredientId);

    const ingredientsRepository = getRepository(this.ingredients);
    const ingredient = await ingredientsRepository.findOne({
      where: { id: ingredientId },
      select: ['name'],
    });
    checkIfConflict(!ingredient);

    return ingredient;
  }

  public async createIngredient(
    ingredientData: CreateIngredientDto,
  ): Promise<void> {
    checkIfEmpty(ingredientData);

    const ingredientsRepository = getRepository(this.ingredients);

    const ingredient = new IngredientEntity();
    ingredient.name = ingredientData.name;

    await ingredientsRepository.save(ingredient);
  }
}

export default IngredientsService;
