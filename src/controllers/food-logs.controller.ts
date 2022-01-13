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
      const { id } = await this.foodLogsService.createUserFoodLogs(
        userId,
        req.body,
      );
      res.sendStatus(HttpStatusCode.CREATED);
      const foodLog = await this.foodLogsService.getFoodLogById(id);
      this.allergensController.addFoodLogAllergens(foodLog);
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
      const prevFoodLog = await this.foodLogsService.getFoodLogById(
        req.body.id,
      );
      await this.foodLogsService.updateUserFoodLogs(userId, req.body);
      res.sendStatus(HttpStatusCode.OK);
      const nextFoodLog = await this.foodLogsService.getFoodLogById(
        req.body.id,
      );
      this.allergensController.diffFoodLogAllergens(prevFoodLog, nextFoodLog);
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
      const foodLog = await this.foodLogsService.getFoodLogById(foodId);
      await this.foodLogsService.deleteFoodLogById(userId, foodId);
      res.sendStatus(HttpStatusCode.OK);
      this.allergensController.removeFoodLogAllergens(foodLog);
    } catch (err) {
      next(err);
    }
  };
}

export default FoodLogsController;
