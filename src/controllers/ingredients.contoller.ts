import { Request, Response, NextFunction } from 'express';
import { CreateProductDto } from '@dtos/products.dto';
import HttpStatusCode from '@interfaces/http-codes.interface';
import IngredientsService from '@services/ingredients.service';
import { CreateIngredientDto } from '../dtos/ingredients.dto';

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

  public findIngredientByQuery = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = req.query;
      throw new Error('Not implemented yet');
      const products = await this.ingredientService.findIngredientByQuery('');

      res.status(HttpStatusCode.OK).json({ ...products });
    } catch (error) {
      next(error);
    }
  };
}

export default IngredientsController;
