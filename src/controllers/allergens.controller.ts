import { NextFunction, Response } from 'express';

import { GetAllergensRequest } from '@interfaces/allergens.interface';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import AllergensService from '@services/allergens.service';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import { FoodLog, FoodLogFindRequest } from '../interfaces/food-logs.interface';
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

  public addFoodLogAllergens = async (foodLog: FoodLog): Promise<void> => {
    const ingredientIds = await this.getIngredientIds(foodLog);
    const symptomLogs = await this.getSymptomNextDay(
      foodLog.userId,
      foodLog.date,
    );

    this.addAllergens([{ ...foodLog, ingredientIds }], symptomLogs);
  };

  public removeFoodLogAllergens = async (foodLog: FoodLog): Promise<void> => {
    const ingredientIds = await this.getIngredientIds(foodLog);
    const symptomLogs = await this.getSymptomNextDay(
      foodLog.userId,
      foodLog.date,
    );

    this.removeAllergens([{ ...foodLog, ingredientIds }], symptomLogs);
  };

  public diffFoodLogAllergens = async (
    prevFoodLog: FoodLog,
    nextFoodLog: FoodLog,
  ): Promise<void> => {
    this.removeFoodLogAllergens(prevFoodLog);
    this.addFoodLogAllergens(nextFoodLog);
  };

  protected addAllergens = (
    foodLogs: (FoodLog & { ingredientIds: number[] })[],
    symptomLogs: SymptomLog[],
  ): void => {
    const userId = foodLogs[0].user?.id || symptomLogs[0].userId;
    foodLogs.forEach(foodLog => {
      symptomLogs.forEach(symptomLog => {
        const points = this.getPoints(foodLog, symptomLog);
        foodLog.ingredientIds.forEach(ingredientId => {
          this.allergensService.incrementAllergen(userId, ingredientId, points);
        });
      });
    });
  };

  protected removeAllergens = (
    foodLogs: (FoodLog & { ingredientIds: number[] })[],
    symptomLogs: SymptomLog[],
  ): void => {
    const userId = foodLogs[0].user?.id || symptomLogs[0].userId;
    foodLogs.forEach(foodLog => {
      symptomLogs.forEach(symptomLog => {
        const points = this.getPoints(foodLog, symptomLog);
        foodLog.ingredientIds.forEach(ingredientId => {
          this.allergensService.decrementAllergen(userId, ingredientId, points);
        });
      });
    });
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
  ): Promise<void> => {
    const foodLogs = await this.getFoodLogPreviousDay(
      symptom.userId,
      symptom.date,
    );

    const foodLogsWithIngredientIds = await Promise.all(
      foodLogs.map(async foodLog => ({
        ...foodLog,
        ingredientIds: await this.getIngredientIds(foodLog),
      })),
    );

    this.addAllergens(foodLogsWithIngredientIds, [symptom]);
  };

  public removeSymptomLogAllergens = async (
    symptom: SymptomLog,
  ): Promise<void> => {
    const foodLogs = await this.getFoodLogPreviousDay(
      symptom.user.id,
      symptom.date,
    );

    const foodLogsWithIngredientIds = await Promise.all(
      foodLogs.map(async foodLog => ({
        ...foodLog,
        ingredientIds: await this.getIngredientIds(foodLog),
      })),
    );

    this.removeAllergens(foodLogsWithIngredientIds, [symptom]);
  };

  public diffSymptomLogAllergens = async (
    prevSymptom: SymptomLog,
    nextSymptom: SymptomLog,
  ): Promise<void> => {
    this.removeSymptomLogAllergens(prevSymptom);
    this.addSymptomLogAllergens(nextSymptom);
  };

  protected getIngredientIds = (foodLog: FoodLog): Promise<number[]> => {
    const ingredientIds =
      foodLog?.ingredients?.map(ingredient => ingredient.id) || [];
    const productIds = foodLog?.products?.map(product => product.id) || [];

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

  protected getFoodLogPreviousDay = (
    userId: number,
    date: Date,
  ): Promise<FoodLog[]> => {
    const previousDay = (next: Date): Date => {
      const resultDay = new Date(next);
      next.setDate(resultDay.getDate() - 1);
      return next;
    };
    const startDate = previousDay(date);
    const endDate = date;

    // TODO: remove limit and get them all
    const limit = 100;

    return this.foodLogService
      .getUserFoodLogs({
        userId,
        startDate,
        endDate,
        limit,
      } as FoodLogFindRequest)
      .then(foodLogs => foodLogs.data);
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

    return this.symptomLogService
      .getSymptomLogs({
        userId,
        startDate,
        endDate,
        limit,
      } as SymptomLogGetRequest)
      .then(symptomLogs => symptomLogs.data as Partial<SymptomLog[]>);
  };
}

export default AllergensController;
