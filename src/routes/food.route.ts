import { Router } from 'express';

import { FoodsController } from '@controllers/foods.controller';
import { getFoodsMiddleware } from '@middlewares/foods.middleware';
import { GetProductDto } from '@dtos/foods.dto';
import { Routes } from '@interfaces/internal/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class FoodsRoute implements Routes {
  public path = '/foods';

  public router = Router();

  public foodsController = new FoodsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(GetProductDto, 'query'),
      getFoodsMiddleware,
      this.foodsController.findFood,
    );
  }
}

export default FoodsRoute;
