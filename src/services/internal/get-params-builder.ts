import { Between, FindManyOptions } from 'typeorm';
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

  protected appendWhere(where: object) {
    if (typeof this.query.where === 'string') {
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

const formatDate = (date: Date) => format(date, DateFormatSQLITE.DATE_TIME);
export const afterDate = (date: Date) =>
  Between(formatDate(date), formatDate(addYears(date, 100)));
export const beforeDate = (date: Date) =>
  Between(subYears(date, 100).toISOString(), date.toISOString());
export const betweenDates = (start: Date, end: Date) =>
  Between(start.toISOString(), end.toISOString());

export default GetParamsBuilder;
