import { Response, NextFunction } from 'express';

import { FoodGetRequest } from '@interfaces/foods.interface';
import FoodsService from '@services/foods.service';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { ControllerOmitHelper } from './internal/omit-helper';

export class FoodsController {
  readonly foodService = new FoodsService();

  public findFood = async (
    req: FoodGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.foodService
        .find(req)
        .then(ControllerOmitHelper.omitCreatedUpdatedAtArray)
        .then(ControllerOmitHelper.omitUserIdArray);
      const total = await this.foodService.count(req);

      res.status(HttpStatusCode.OK).json({ data, total });
    } catch (error) {
      next(error);
    }
  };
}

export default FoodsController;
