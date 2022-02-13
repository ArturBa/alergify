import { NextFunction, Response } from 'express';

import { AllergensEntity } from '@entity/allergens.entity';
import { AllergensService } from '@services/allergens.service';
import { FoodLog } from '@interfaces/food-logs.interface';
import { FoodLogsService } from '@services/food-logs.service';
import { GetAllergensRequest } from '@interfaces/allergens.interface';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { ProductsService } from '@services/products.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import { SymptomLog } from '@interfaces/symptom-logs.interface';
import { SymptomLogsService } from '@services/symptom-logs.service';

import { ControllerOmitHelper } from './internal/omit-helper';

export class AllergensController {
  public allergensService = new AllergensService();

  public foodLogService = new FoodLogsService();

  public symptomLogService = new SymptomLogsService();

  public productService = new ProductsService();

  readonly allergensMaxPoints = 24;

  public getAllergens = async (
    req: GetAllergensRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const likelihood = (
      dto: AllergensEntity,
    ): Partial<AllergensEntity> & { likelihood: number } => {
      const dtoCopy: any = { ...dto };
      dtoCopy.likelihood = dtoCopy.points / dtoCopy.count / 24;
      dtoCopy.likelihood = dtoCopy.likelihood
        ? dtoCopy.likelihood.toFixed(2)
        : null;
      delete dtoCopy.points;
      delete dtoCopy.count;
      return dtoCopy;
    };
    const likelihoodArray = (
      dto: AllergensEntity[],
    ): (Partial<AllergensEntity> & { likelihood: number })[] => {
      return ControllerOmitHelper.omitArray(dto, likelihood);
    };

    try {
      const data = await this.allergensService
        .find({ ...req })
        .then(likelihoodArray)
        .then(ControllerOmitHelper.omitCreatedUpdatedAtArray)
        .then(ControllerOmitHelper.omitUserIdArray);
      const total = await this.allergensService.count({ ...req });
      res.status(HttpStatusCode.OK).json({ data, total });
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
      await this.allergensService.set({ ingredientId, userId });

      res.sendStatus(HttpStatusCode.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  };

  public unsetAllergen = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ingredientId = Number(req.params.id);
      const { userId } = req;
      await this.allergensService.unset({ userId, ingredientId });

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
    const symptomLog = symptomLogs.length ? [symptomLogs[0]] : [];

    ingredientIds.forEach(ingredientId => {
      this.allergensService.increment({
        ingredientId,
        userId: foodLog.userId,
      });
    });
    this.addAllergens([{ ...foodLog, ingredientIds }], symptomLog);
  };

  public removeFoodLogAllergens = async (foodLog: FoodLog): Promise<void> => {
    const ingredientIds = await this.getIngredientIds(foodLog);
    const symptomLogs = await this.getSymptomNextDay(
      foodLog.userId,
      foodLog.date,
    );
    const symptomLog = symptomLogs.length ? [symptomLogs[0]] : [];

    ingredientIds.forEach(ingredientId => {
      this.allergensService.decrement({
        ingredientId,
        userId: foodLog.userId,
      });
    });
    this.removeAllergens([{ ...foodLog, ingredientIds }], symptomLog);
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
    const { userId } = foodLogs[0];
    foodLogs.forEach(foodLog => {
      symptomLogs.forEach(symptomLog => {
        const points = this.getPoints(foodLog, symptomLog);
        foodLog.ingredientIds.forEach(ingredientId => {
          this.allergensService.addPoints({ userId, ingredientId }, points);
        });
      });
    });
  };

  protected removeAllergens = (
    foodLogs: (FoodLog & { ingredientIds: number[] })[],
    symptomLogs: SymptomLog[],
  ): void => {
    const { userId } = foodLogs[0];
    foodLogs.forEach(foodLog => {
      symptomLogs.forEach(symptomLog => {
        const points = this.getPoints(foodLog, symptomLog);
        foodLog.ingredientIds.forEach(ingredientId => {
          this.allergensService.subtractPoints(
            { userId, ingredientId },
            points,
          );
        });
      });
    });
  };

  protected getPoints(
    { date: foodLogDate }: FoodLog,
    { date: symptomLogDate }: SymptomLog,
  ): number {
    return (
      this.allergensMaxPoints -
      Math.floor(
        Math.abs(symptomLogDate.getTime() - foodLogDate.getTime()) / 3.6e6,
      )
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

    foodLogsWithIngredientIds.forEach(async foodLog => {
      const symptomLogs = await this.getSymptomNextDay(
        symptom.userId,
        foodLog.date,
      );

      if (symptomLogs[0].id === symptom.id) {
        this.addAllergens([foodLog], [symptom]);
        if (symptomLogs[1]) {
          this.removeAllergens([foodLog], [symptomLogs[1]]);
        }
      }
    });
  };

  public removeSymptomLogAllergens = async (
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

    foodLogsWithIngredientIds.forEach(async foodLog => {
      const symptomLogs = await this.getSymptomNextDay(
        symptom.userId,
        foodLog.date,
      );

      if (symptomLogs.length && symptomLogs[0].date > symptom.date) {
        this.removeAllergens([foodLog], [symptom]);
        this.addAllergens([foodLog], [symptomLogs[0]]);
      }
      if (!symptomLogs.length) {
        this.removeAllergens([foodLog], [symptom]);
      }
    });
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
      ...productIds.map(id => this.productService.get({ id })),
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
      resultDay.setDate(resultDay.getDate() - 1);
      return resultDay;
    };
    const startDate = previousDay(date);
    const endDate = new Date(date);

    return this.foodLogService.find({
      userId,
      startDate,
      endDate,
    });
  };

  protected getSymptomNextDay = (
    userId: number,
    date: Date,
  ): Promise<Partial<SymptomLog[]>> => {
    const nextDay = (next: Date): Date => {
      const resultDay = new Date(next);
      resultDay.setDate(resultDay.getDate() + 1);
      return resultDay;
    };

    const startDate = new Date(date);
    const endDate = nextDay(date);

    return this.symptomLogService.find({
      userId,
      startDate,
      endDate,
    });
  };
}

export default AllergensController;
