import { dateParamsMiddleware } from './internal/date.middleware';
import { paginateParamsMiddleware } from './internal/paginate.middleware';

export const getSymptomLogsMiddleware = [
  paginateParamsMiddleware,
  dateParamsMiddleware,
];

export default getSymptomLogsMiddleware;
