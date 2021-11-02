import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class FoodRoute implements Routes {
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
      this.foodLogsController.getFoodLogs,
    );
  }
}
