import { isEmpty } from '@utils/util';
import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

export function checkIfEmpty(value: any, msg = 'Missing data'): void {
  if (isEmpty(value)) throw new HttpException(HttpStatusCode.BAD_REQUEST, msg);
}

export function checkIfConflict(value: any, msg = 'Conflict'): void {
  if (value) throw new HttpException(HttpStatusCode.CONFLICT, msg);
}
