import {
  dateParamsMiddleware,
  paginateParamsMiddleware,
} from './internal/parameters.middleware';

export const getSymptomLogsMiddleware = [
  paginateParamsMiddleware,
  dateParamsMiddleware,
];

export default getSymptomLogsMiddleware;
