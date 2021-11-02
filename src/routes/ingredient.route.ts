import { Router } from 'express';
import IngredientsController from '@controllers/ingredients.contoller';
import { CreateIngredientDto } from '@dtos/ingredients.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class IngredientRoute implements Routes {
  public path = '/ingredient';
  public router = Router();
  public ingredientsController = new IngredientsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateIngredientDto),
      this.ingredientsController.createIngredient,
    );
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.ingredientsController.getIngredientById,
    );
  }
}

export default IngredientRoute;
