import { RequestWithUser } from './auth.interface';

export interface RequestWithPagination extends RequestWithUser {
  start: number;
  limit: number;
}

export interface PaginateRequest {
  start: number;
  limit: number;
}

export interface PaginateResponse<T> {
  data: T[];
  total: number;
}
