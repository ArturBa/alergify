import { Response, NextFunction } from 'express';

import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { IngredientGetRequest } from '@interfaces/ingredients.interface';
import { IngredientsServiceBase } from '@services/ingredients-base.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';

import { ControllerOmitHelper } from './internal/omit-helper';

class IngredientsController {
  public ingredientServiceBase = new IngredientsServiceBase();

  public get = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const ingredient = await this.ingredientServiceBase.get({
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
      await this.ingredientServiceBase.create({ ...req.body, userId });

      res.sendStatus(HttpStatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public find = async (
    req: IngredientGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.ingredientServiceBase
        .find(req)
        .then(ControllerOmitHelper.omitUserIdArray)
        .then(ControllerOmitHelper.omitCreatedUpdatedAtArray);
      const count = await this.ingredientServiceBase.count(req);

      res.status(HttpStatusCode.OK).json({ data, count });
    } catch (error) {
      next(error);
    }
  };
}

export default IngredientsController;
