import { Router } from 'express';
import { FoodLogsController } from '@controllers/food-logs.controller';
import { CreateFoodLogDto } from '@dtos/food-logs.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class FoodLogsRoute implements Routes {
  public path = '/food';
  public router = Router();
  public foodLogsController = new FoodLogsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.foodLogsController.getUserFoodLogs,
    );
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateFoodLogDto),
      this.foodLogsController.createUserFoodLogs,
    );
  }
}

export default FoodLogsRoute;
