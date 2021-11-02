import { Response, NextFunction } from 'express';

import FoodLogsService from '@services/food-logs.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import HttpStatusCode from '@interfaces/http-codes.interface';

class FoodLogsController {
  public foodLogsService = new FoodLogsService();

  public getUserFoodLogs = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user.id;
    const foodLogs = await this.foodLogsService.getUserFoodLogs(userId);
    res.status(HttpStatusCode.OK).json(foodLogs);
  };
}
