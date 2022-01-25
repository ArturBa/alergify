import { Router } from 'express';

import { GetAllergensDto } from '@dtos/allergens.dto';
import { getAllergensMiddleware } from '@middlewares/allergens.middleware';
import { Routes } from '@interfaces/internal/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { AllergensController } from '@/controllers/allergens.controller';

class AllergensRoute implements Routes {
  public path = '/allergens';

  public router = Router();

  public allergensController = new AllergensController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(GetAllergensDto, 'query'),
      getAllergensMiddleware,
      this.allergensController.getAllergens,
    );
    this.router.post(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.allergensController.setAllergen,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.allergensController.unsetAllergen,
    );
  }
}

export default AllergensRoute;
