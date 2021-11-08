import { NextFunction, Request, Response } from 'express';
import SymptomService from '@services/symptoms.service';

class SymptomsController {
  public symptomService = new SymptomService();

  public getSymptoms = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptoms = await this.symptomService.getAllSymptoms();

      res.status(200).json({ data: symptoms });
    } catch (error) {
      next(error);
    }
  };

  public getSymptomById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const symptomId = Number(req.params.id);
      const findOneUserData = await this.symptomService.findSymptomById(
        symptomId,
      );

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };
}

export default SymptomsController;
