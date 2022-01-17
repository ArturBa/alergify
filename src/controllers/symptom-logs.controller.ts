import { NextFunction, Response } from 'express';

import { SymptomLogsService } from '@services/symptom-logs.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { SymptomLogFindRequest } from '@interfaces/symptom-logs.interface';

import { AllergensController } from './allergens.controller';

class SymptomLogsController {
  public symptomLogService = new SymptomLogsService();

  public allergensController = new AllergensController();

  public getSymptomLogs = async (
    req: SymptomLogFindRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.symptomLogService.find(req);
      const count = await this.symptomLogService.count(req);

      res.status(HttpStatusCode.OK).json({ data, count });
    } catch (error) {
      next(error);
    }
  };

  public getSymptomLogById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptomId = Number(req.params.id);
      const data = await this.symptomLogService.get({
        ...req,
        id: symptomId,
      });

      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createSymptomLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptomLog = await this.symptomLogService.create({
        ...req.body,
        userId: req.userId,
      });

      res.sendStatus(HttpStatusCode.CREATED);
      this.allergensController.addSymptomLogAllergens(symptomLog);
    } catch (error) {
      next(error);
    }
  };

  public updateSymptomLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const prevSymptomLog = await this.symptomLogService.get({
        id: req.body.id,
        userId: req.userId,
      });
      const nextSymptomLog = await this.symptomLogService.update({
        ...req.body,
        userId: req.userId,
      });

      res.sendStatus(HttpStatusCode.NO_CONTENT);
      this.allergensController.diffSymptomLogAllergens(
        prevSymptomLog,
        nextSymptomLog,
      );
    } catch (error) {
      next(error);
    }
  };

  public deleteSymptomLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptomId = Number(req.params.id);
      const symptomLog = await this.symptomLogService.remove({
        id: symptomId,
        userId: req.userId,
      });

      res.sendStatus(HttpStatusCode.NO_CONTENT);
      this.allergensController.removeSymptomLogAllergens(symptomLog);
    } catch (error) {
      next(error);
    }
  };
}

export default SymptomLogsController;
