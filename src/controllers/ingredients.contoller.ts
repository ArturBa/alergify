import { Request, Response, NextFunction } from 'express';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import IngredientsService from '@services/ingredients.service';
import { CreateIngredientDto } from '@dtos/ingredients.dto';
import { IngredientGetRequest } from '../interfaces/ingredients.interface';

class IngredientsController {
  public ingredientService = new IngredientsService();

  public getIngredientById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const ingredient = await this.ingredientService.getIngredientById(
        ingredientId,
      );

      res.status(HttpStatusCode.OK).json({ ...ingredient });
    } catch (error) {
      next(error);
    }
  };

  public createIngredient = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientData: CreateIngredientDto = req.body;
      await this.ingredientService.createIngredient(ingredientData);

      res.sendStatus(HttpStatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public findIngredients = async (
    req: IngredientGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const products = await this.ingredientService.findIngredients(req);

      res.status(HttpStatusCode.OK).json({ ...products });
    } catch (error) {
      next(error);
    }
  };
}

export default IngredientsController;
