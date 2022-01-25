import {
  Between,
  FindConditions,
  FindManyOptions,
  ObjectLiteral,
} from 'typeorm';
import { addYears, format, subYears } from 'date-fns';

export abstract class GetParamsBuilder<Entity, Request> {
  protected query: FindManyOptions<Entity> = {};

  constructor() {
    this.query = {};
  }

  abstract build(request: Request): void;

  get(): FindManyOptions<Entity> {
    return this.query;
  }

  getTotal(): FindManyOptions<Entity> {
    const totalQuery = { ...this.query };
    delete totalQuery.skip;
    delete totalQuery.take;
    return totalQuery;
  }

  protected appendWhere(
    where:
      | FindConditions<Entity>[]
      | FindConditions<Entity>
      | ObjectLiteral
      | string,
  ) {
    if (typeof where === 'string' || typeof this.query.where === 'string') {
      if (
        typeof where !== 'string' ||
        (this.query.where && typeof this.query.where !== 'string')
      ) {
        throw new Error('Where is already string');
      }
      this.query.where =
        this.query.where === undefined
          ? where
          : (this.query.where += ` AND ${where}`);
      return;
    }
    this.query = {
      ...this.query,
      where: {
        ...this.query.where,
        ...where,
      },
    };
  }
}

enum DateFormatSQLITE {
  DATE = 'yyyy-MM-dd',
  DATE_TIME = 'yyyy-MM-dd HH:MM:ss',
}

export const formatDate = (date: Date) =>
  format(date, DateFormatSQLITE.DATE_TIME);
export const afterDate = (date: Date) =>
  Between(formatDate(date), formatDate(addYears(date, 100)));
export const beforeDate = (date: Date) =>
  Between(formatDate(subYears(date, 100)), formatDate(date));
export const betweenDates = (start: Date, end: Date) =>
  Between(formatDate(start), formatDate(end));

export default GetParamsBuilder;
