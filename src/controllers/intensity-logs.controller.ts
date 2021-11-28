import { NextFunction, Response } from 'express';

import { RequestWithUser } from '@interfaces/internal/auth.interface';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';
import IntensityLogService from '@services/intensity-logs.service';

class IntensityLogsController {
  public intensityLogService = new IntensityLogService();

  public createIntensityLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.intensityLogService.createIntensityLog(req.body);

      res.status(HttpStatusCode.CREATED);
    } catch (error) {
      next(error);
    }
  };

  public updateIntensityLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.intensityLogService.updateIntensityLog(req.body);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public deleteIntensityLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const intensityLogId = Number(req.params.id);
      await this.intensityLogService.deleteIntensityLog(intensityLogId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default IntensityLogsController;
