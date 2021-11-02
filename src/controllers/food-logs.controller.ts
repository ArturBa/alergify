import { Response, NextFunction } from 'express';

import FoodLogsService from '@services/food-logs.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import HttpStatusCode from '@interfaces/http-codes.interface';

export class FoodLogsController {
  public foodLogsService = new FoodLogsService();

  public getUserFoodLogs = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.id;
      const foodLogs = await this.foodLogsService.getUserFoodLogs(userId);
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
      const userId = req.user.id;
      await this.foodLogsService.createUserFoodLogs(userId, req.body);
      res.sendStatus(HttpStatusCode.CREATED);
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
      const userId = req.user.id;
      await this.foodLogsService.updateUserFoodLogs(userId, req.body);
      res.sendStatus(HttpStatusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  public getUserFoodLogById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.id;
      const foodId = Number(req.params.id);
      const foodLog = await this.foodLogsService.findUserFoodLogById(
        userId,
        foodId,
      );
      res.status(HttpStatusCode.OK).json(foodLog);
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
      const userId = req.user.id;
      const foodId = Number(req.params.id);
      await this.foodLogsService.deleteFoodLogById(userId, foodId);
      res.sendStatus(HttpStatusCode.OK);
    } catch (err) {
      next(err);
    }
  };
}
