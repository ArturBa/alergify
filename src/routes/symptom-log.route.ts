import { Router } from 'express';
import { Routes } from '@interfaces/internal/routes.interface';
import SymptomLogsController from '@controllers/symptom-logs.controller';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import {
  CreateSymptomLogDto,
  UpdateSymptomLogDto,
} from '@dtos/symptom-logs.dto';

class SymptomLogsRoute implements Routes {
  public path = '/symptom-log';

  public router = Router();

  public symptomLogsController = new SymptomLogsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @openapi
     * /symptom-log-infile:
     *  get:
     *    security:
     *      - bearerAuth: []
     *    description: Get symptoms
     *    parameters:
     *      - $ref: '#/components/parameters/paginate'
     *    responses:
     *      200:
     *        description: Symptoms
     *        content:
     *          application/json:
     *            schema:
     *              allOf:
     *                - $ref: '#/components/schemas/paginate-response'
     *                - type: object
     *                  properties:
     *                    data:
     *                      type: array
     *                      items:
     *                        allOf:
     *                          - $ref: '#/components/schemas/symptom-log-get'
     *                          - $ref: '#/components/schemas/id'
     */
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.symptomLogsController.getSymptomLogs,
    );
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateSymptomLogDto),
      this.symptomLogsController.createSymptomLog,
    );
    this.router.put(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(UpdateSymptomLogDto),
      this.symptomLogsController.updateSymptomLog,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.symptomLogsController.deleteSymptomLog,
    );
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.symptomLogsController.getSymptomLogById,
    );
  }
}

export default SymptomLogsRoute;
