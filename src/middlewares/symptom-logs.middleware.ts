import { NextFunction, Response } from 'express';
import { SymptomLogGetRequest } from '@interfaces/symptom-logs.interface';
import {
  dateParamsMiddleware,
  paginateParamsMiddleware,
} from './internal/parameters.middleware';

export const getSymptomLogMiddleware = (
  req: SymptomLogGetRequest,
  res: Response,
  next: NextFunction,
) => {
  return [
    paginateParamsMiddleware(req, res, next),
    dateParamsMiddleware(req, res, next),
  ];
};

export default getSymptomLogMiddleware;
