import { Router } from 'express';
import IngredientsController from '@controllers/ingredients.contoller';
import { IngredientCreateDto, IngredientFindDto } from '@dtos/ingredients.dto';
import { Routes } from '@interfaces/internal/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { ingredientsFindMiddleware } from '@middlewares/ingredients.middleware';

class IngredientRoute implements Routes {
  public path = '/ingredient';

  public router = Router();

  public ingredientsController = new IngredientsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(IngredientCreateDto),
      this.ingredientsController.create,
    );
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.ingredientsController.get,
    );
    this.router.get(
      `${this.path}`,
      authMiddleware,
      ingredientsFindMiddleware,
      this.ingredientsController.find,
    );
  }
}

export default IngredientRoute;
