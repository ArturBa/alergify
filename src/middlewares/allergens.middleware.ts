import { paginateParamsMiddleware } from './internal/paginate.middleware';

export const getAllergensMiddleware = [paginateParamsMiddleware];

export default getAllergensMiddleware;
