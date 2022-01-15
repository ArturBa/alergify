import { Response, NextFunction } from 'express';

import { FoodLogGetRequest } from '@interfaces/food-logs.interface';
import { FoodLogsService } from '@services/food-logs.service';
import { FoodLogsServiceBase } from '@services/food-logs-base.service';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { RequestWithUser } from '@interfaces/internal/auth.interface';

import AllergensController from './allergens.controller';

export class FoodLogsController {
  public foodLogsService = new FoodLogsService();

  public foodLogsServiceBase = new FoodLogsServiceBase();

  public allergensController = new AllergensController();

  public getUserFoodLogs = async (
    req: FoodLogGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.foodLogsServiceBase.find(req).then(foodLogs => {
        return foodLogs.map(foodLog => {
          const foodLogNoUserId = { ...foodLog };
          delete foodLogNoUserId.userId;
          return foodLogNoUserId;
        });
      });
      const count = await this.foodLogsServiceBase.count(req);
      res.status(HttpStatusCode.OK).json({ data, count });
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
      const foodLog = await this.foodLogsServiceBase.get({ id });
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
      // const foodLog = await this.foodLogsService.getFoodLogById(foodId);
      const foodLog = await this.foodLogsServiceBase.remove({
        userId,
        id: foodId,
      });
      res.sendStatus(HttpStatusCode.NO_CONTENT);
      this.allergensController.removeFoodLogAllergens(foodLog);
    } catch (err) {
      next(err);
    }
  };
}

export default FoodLogsController;
