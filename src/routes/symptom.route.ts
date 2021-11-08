import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
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
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.symptomsController.getSymptomById,
    );
  }
}

export default SymptomsRoute;
