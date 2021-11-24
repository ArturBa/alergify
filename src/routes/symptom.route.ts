import { Router } from 'express';
import { Routes } from '@interfaces/internal/routes.interface';
import SymptomsController from '@controllers/symptoms.controller';
import authMiddleware from '@middlewares/auth.middleware';

class SymptomsRoute implements Routes {
  public path = '/symptoms';

  public router = Router();

  public symptomsController = new SymptomsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.symptomsController.getSymptoms,
    );
  }
}

export default SymptomsRoute;
