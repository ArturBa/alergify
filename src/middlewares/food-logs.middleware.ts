import { dateParamsMiddleware } from './internal/date.middleware';
import { paginateParamsMiddleware } from './internal/paginate.middleware';

export const getFoodLogsMiddleware = [
  paginateParamsMiddleware,
  dateParamsMiddleware,
];

export default getFoodLogsMiddleware;
