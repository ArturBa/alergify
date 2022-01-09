import { Response, NextFunction } from 'express';

import { FoodGetRequest } from '@interfaces/foods.interface';
import FoodsService from '@services/foods.service';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';

export class FoodsController {
  readonly foodService = new FoodsService();

  public findFood = async (
    req: FoodGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const response = await this.foodService.findFood(req);

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default FoodsController;
