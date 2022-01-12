import { NextFunction, Response } from 'express';

import { GetAllergensRequest } from '@interfaces/allergens.interface';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import AllergensService from '@services/allergens.service';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import { FoodLog } from '../interfaces/food-logs.interface';
import {
  SymptomLog,
  SymptomLogGetRequest,
} from '../interfaces/symptom-logs.interface';
import ProductsService from '../services/products.service';
import FoodLogsService from '../services/food-logs.service';
import SymptomLogService from '../services/symptom-logs.service';

class AllergensController {
  public allergensService = new AllergensService();

  public foodLogService = new FoodLogsService();

  public symptomLogService = new SymptomLogService();

  public productService = new ProductsService();

  public getAllergens = async (
    req: GetAllergensRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response = await this.allergensService.getAllergens(req);
      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  public setAllergen = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const { userId } = req;
      await this.allergensService.setAllergen(userId, ingredientId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public removeAllergen = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const { userId } = req;
      await this.allergensService.removeAllergen(userId, ingredientId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public addFoodLogAllergens = async (
    userId: number,
    foodLog: FoodLog,
  ): Promise<void> => {
    const symptomLogs = await this.getSymptomNextDay(
      foodLog.user.id,
      foodLog.date,
    );
    const ingredients = await this.getIngredientIds(foodLog);
    this.addAllergens(
      userId,
      [{ ...foodLog, ingredientsIds: ingredients }],
      symptomLogs,
    );
  };

  protected addAllergens = (
    userId: number,
    foodLogs: (FoodLog & { ingredientsIds: number[] })[],
    symptomLogs: SymptomLog[],
  ): void => {
    foodLogs.forEach(foodLog => {
      symptomLogs.forEach(symptomLog => {
        const points = this.getPoints(foodLog, symptomLog);
        foodLog.ingredientsIds.forEach(ingredientId => {
          this.allergensService.incrementAllergen(userId, ingredientId, points);
        });
      });
    });
    this.addSymptomLogAllergens(null);
  };

  // eslint-disable-next-line class-methods-use-this
  protected getPoints(
    { date: foodLogDate }: FoodLog,
    { date: symptomLogDate }: SymptomLog,
  ): number {
    return Math.floor(
      Math.abs(foodLogDate.getTime() - symptomLogDate.getTime()) / 3.6e6,
    );
  }

  public addSymptomLogAllergens = async (
    symptom: SymptomLog,
  ): Promise<void> => {};

  protected getIngredientIds = (foodLog: FoodLog): Promise<number[]> => {
    const ingredientIds =
      foodLog.ingredients?.map(ingredient => ingredient.id) || [];
    const productIds = foodLog.products?.map(product => product.id) || [];

    return Promise.all([
      ...productIds.map(id => this.productService.getProductById(id)),
    ]).then(products => {
      const productIngredientIds = products
        .map(product => product.ingredients)
        .map(ingredients => ingredients.map(ingredient => ingredient.id))
        .flat();
      return [...new Set([...ingredientIds, ...productIngredientIds])];
    });
  };

  protected getFoodLogPreviousDay = (userId: number, date: Date): FoodLog[] => {
    return [];
  };

  protected getSymptomNextDay = (
    userId: number,
    date: Date,
  ): Promise<Partial<SymptomLog[]>> => {
    const nextDay = (next: Date): Date => {
      const resultDay = new Date(next);
      next.setDate(resultDay.getDate() + 1);
      return next;
    };

    const startDate = new Date(date);
    const endDate = nextDay(date);

    const limit = 100;
    console.log('userId', userId);

    return this.symptomLogService
      .getSymptomLogs({
        userId,
        startDate,
        endDate,
        limit,
      } as SymptomLogGetRequest)
      .then(symptomLogs => symptomLogs.data as Partial<SymptomLog[]>);

    return Promise.resolve([]);
  };
}

export default AllergensController;
