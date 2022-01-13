import { NextFunction, Response } from 'express';

import SymptomLogService from '@services/symptom-logs.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import { SymptomLogGetRequest } from '@interfaces/symptom-logs.interface';

import AllergensController from './allergens.controller';

class SymptomLogsController {
  public symptomLogService = new SymptomLogService();

  public allergensController = new AllergensController();

  public getSymptomLogs = async (
    req: SymptomLogGetRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptomLogs = await this.symptomLogService.getSymptomLogs(req);

      res.status(HttpStatusCode.OK).json(symptomLogs);
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
      const findOneUserData = await this.symptomLogService.findSymptomLogById(
        symptomId,
        req.userId,
      );

      res.status(HttpStatusCode.OK).json(findOneUserData);
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
      const { id } = await this.symptomLogService.createSymptom(
        req.body,
        req.userId,
      );

      res.sendStatus(HttpStatusCode.CREATED);
      const symptomLog = await this.symptomLogService.getSymptomLogById(id);
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
      const prevSymptomLog = await this.symptomLogService.getSymptomLogById(
        req.body.id,
      );
      await this.symptomLogService.updateSymptom(req.body, req.userId);

      res.sendStatus(HttpStatusCode.OK);
      const nextSymptomLog = await this.symptomLogService.getSymptomLogById(
        req.body.id,
      );
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
      const symptomLog = await this.symptomLogService.getSymptomLogById(
        symptomId,
      );
      await this.symptomLogService.deleteSymptomLog(symptomId, req.userId);

      res.sendStatus(HttpStatusCode.OK);
      this.allergensController.removeSymptomLogAllergens(symptomLog);
    } catch (error) {
      next(error);
    }
  };
}

export default SymptomLogsController;
