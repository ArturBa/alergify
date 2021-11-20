import { NextFunction, Request, Response } from 'express';
import SymptomService from '@services/symptoms.service';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';

class SymptomsController {
  public symptomService = new SymptomService();

  public getSymptoms = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptoms = await this.symptomService.getAllSymptoms();

      res.status(HttpStatusCode.OK).json(symptoms);
    } catch (error) {
      next(error);
    }
  };
}

export default SymptomsController;
