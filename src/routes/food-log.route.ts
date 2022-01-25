import { Router } from 'express';

import {
  CreateFoodLogDto,
  FindFoodLogsDto,
  UpdateFoodLogDto,
} from '@dtos/food-logs.dto';
import { FoodLogsController } from '@controllers/food-logs.controller';
import { getFoodLogsMiddleware } from '@middlewares/food-logs.middleware';
import { Routes } from '@interfaces/internal/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class FoodLogsRoute implements Routes {
  public path = '/food-log';

  public router = Router();

  public foodLogsController = new FoodLogsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(FindFoodLogsDto, 'query'),
      getFoodLogsMiddleware,
      this.foodLogsController.getUserFoodLogs,
    );
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateFoodLogDto),
      this.foodLogsController.createUserFoodLogs,
    );
    this.router.put(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(UpdateFoodLogDto),
      this.foodLogsController.updateUserFoodLogs,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.foodLogsController.deleteUserFoodLogById,
    );
  }
}

export default FoodLogsRoute;
