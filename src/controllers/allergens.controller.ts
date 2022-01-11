import { NextFunction, Response } from 'express';

import { GetAllergensRequest } from '@interfaces/allergens.interface';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import AllergensService from '@services/allergens.service';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';

class AllergensController {
  public allergensService = new AllergensService();

  public getAllergens = async (
    req: GetAllergensRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response = await this.allergensService.getAllergens(req);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public setAllergen = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const { userId } = req;
      await this.allergensService.setAllergen(userId, ingredientId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public removeAllergen = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const { userId } = req;
      await this.allergensService.removeAllergen(userId, ingredientId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default AllergensController;
