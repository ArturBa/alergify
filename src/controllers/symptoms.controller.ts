import { NextFunction, Request, Response } from 'express';

import { SymptomService } from '@services/symptoms.service';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { ControllerOmitHelper } from './internal/omit-helper';

class SymptomsController {
  public symptomService = new SymptomService();

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptoms = await this.symptomService
        .find({})
        .then(ControllerOmitHelper.omitCreatedUpdatedAtArray);

      res.status(HttpStatusCode.OK).json(symptoms);
    } catch (error) {
      next(error);
    }
  };
}

export default SymptomsController;
