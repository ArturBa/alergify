import { Response, NextFunction } from 'express';

import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { IngredientFindRequest } from '@interfaces/ingredients.interface';
import { IngredientsService } from '@services/ingredients.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';

import { ControllerOmitHelper } from './internal/omit-helper';

export class IngredientsController {
  public ingredientService = new IngredientsService();

  public get = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const ingredient = await this.ingredientService.get({
        ...req,
        id: ingredientId,
      });
      res.status(HttpStatusCode.OK).json({ ...ingredient });
    } catch (error) {
      next(error);
    }
  };

  public create = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req;
      await this.ingredientService.create({ ...req.body, userId });

      res.sendStatus(HttpStatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public find = async (
    req: IngredientFindRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.ingredientService
        .find(req)
        .then(ControllerOmitHelper.omitUserIdArray)
        .then(ControllerOmitHelper.omitCreatedUpdatedAtArray);
      const total = await this.ingredientService.count(req);

      res.status(HttpStatusCode.OK).json({ data, total });
    } catch (error) {
      next(error);
    }
  };
}

export default IngredientsController;
