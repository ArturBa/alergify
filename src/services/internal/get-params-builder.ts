import { Between, FindManyOptions } from 'typeorm';
import { addYears, subYears } from 'date-fns';

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

export const afterDate = (date: Date) => Between(date, addYears(date, 100));
export const beforeDate = (date: Date) => Between(subYears(date, 100), date);
export const betweenDates = (start: Date, end: Date) => Between(start, end);

export default GetParamsBuilder;
