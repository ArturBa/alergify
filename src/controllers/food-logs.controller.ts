import { Response, NextFunction } from 'express';

import FoodLogsService from '@services/food-logs.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import { FoodLogGetRequest } from '@interfaces/food-logs.interface';
import AllergensController from './allergens.controller';

export class FoodLogsController {
  public foodLogsService = new FoodLogsService();

  public allergensController = new AllergensController();

  public getUserFoodLogs = async (
    req: FoodLogGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const foodLogs = await this.foodLogsService.getUserFoodLogs(req);
      res.status(HttpStatusCode.OK).json(foodLogs);
    } catch (err) {
      next(err);
    }
  };

  public createUserFoodLogs = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req;
      const foodLog = await this.foodLogsService.createUserFoodLogs(
        userId,
        req.body,
      );
      res.sendStatus(HttpStatusCode.CREATED);
      console.log('added a food log', foodLog);
      this.allergensController.addFoodLogAllergens(userId, foodLog);
    } catch (err) {
      next(err);
    }
  };

  public updateUserFoodLogs = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req;
      await this.foodLogsService.updateUserFoodLogs(userId, req.body);
      res.sendStatus(HttpStatusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  public deleteUserFoodLogById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req;
      const foodId = Number(req.params.id);
      await this.foodLogsService.deleteFoodLogById(userId, foodId);
      res.sendStatus(HttpStatusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}

export default FoodLogsController;
