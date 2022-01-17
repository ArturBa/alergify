import { NextFunction, Response } from 'express';

import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { IntensityLogService } from '@services/intensity-logs.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';

class IntensityLogsController {
  public intensityLogService = new IntensityLogService();

  public createIntensityLog = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.intensityLogService.create(req.body);

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
      await this.intensityLogService.update(req.body);

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
      await this.intensityLogService.remove({
        id: intensityLogId,
        userId: req.userId,
      });

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default IntensityLogsController;
