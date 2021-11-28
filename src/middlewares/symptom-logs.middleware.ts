import {
  dateParamsMiddleware,
  paginateParamsMiddleware,
} from './internal/parameters.middleware';

export const getSymptomLogsMiddleware = {
  paginate(req, res, next) {
    paginateParamsMiddleware(req, res, next);
    next();
  },
  date(req, res, next) {
    dateParamsMiddleware(req, res, next);
    next();
  },
};

export const getSymptomLogMiddleware = [
  getSymptomLogsMiddleware.paginate,
  getSymptomLogsMiddleware.date,
];

export default getSymptomLogMiddleware;
