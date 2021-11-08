import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import IntensityLogsController from '@controllers/intensity-logs.controller';
import { CreateIntensityLogDto } from '@dtos/intensity-logs.dto';

class IntensityLogsRoute implements Routes {
  public path = '/intensity-log';
  public router = Router();
  public symptomLogsController = new IntensityLogsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateIntensityLogDto),
      this.symptomLogsController.createIntensityLog,
    );
    this.router.put(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateIntensityLogDto, 'body', true),
      this.symptomLogsController.updateIntensityLog,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.symptomLogsController.deleteIntensityLog,
    );
  }
}

export default IntensityLogsRoute;
