import { addYears, format, subYears } from 'date-fns';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntity } from '@entity/base.entity';
import {
  BaseFindParameters,
  BaseGetParameters,
} from '@interfaces/internal/parameters.interface';
import { isEmpty } from '@utils/util';

enum DateFormatSQLITE {
  DATE = 'yyyy-MM-dd',
  DATE_TIME = 'yyyy-MM-dd HH:MM:ss',
}

export const formatDate = (date: Date) =>
  format(date, DateFormatSQLITE.DATE_TIME);

export class BaseFindParametersQueryBuilder<Entity extends BaseEntity> {
  protected getAlias(): string {
    return null;
  }

  protected query: SelectQueryBuilder<Entity>;

  constructor(repository: Repository<Entity>) {
    this.query = repository.createQueryBuilder(this.getAlias());
  }

  select(select: string[]): void {
    this.query = this.query.select(select);
  }

  build(
    request: BaseFindParameters,
    { orderByDate }: { orderByDate: boolean } = { orderByDate: false },
  ): void {
    this.addUser(request);
    this.addDateRange(request);
    this.addPagination(request);
    this.addId(request as BaseGetParameters);

    if (orderByDate) {
      this.orderByDate();
    }
  }

  get(): SelectQueryBuilder<Entity> {
    return this.query;
  }

  protected getAliasPrefix(): string {
    return this.getAlias() ? `${this.getAlias()}.` : '';
  }

  protected addUser({ userId }: BaseFindParameters): void {
    if (userId) {
      this.query.andWhere(`${this.getAliasPrefix()}userId = :userId`, {
        userId,
      });
    }
  }

  protected addDateRange({ startDate, endDate }: BaseFindParameters): void {
    let startDateInput = startDate;
    let endDateInput = endDate;
    if (isEmpty(startDate) && isEmpty(endDate)) {
      return;
    }
    if (!isEmpty(startDate)) {
      endDateInput = addYears(startDate, 100);
    } else if (!isEmpty(endDate)) {
      startDateInput = subYears(endDate, 100);
    }
    this.query = this.query.andWhere(
      `${this.getAliasPrefix()}date BETWEEN :startDate AND :endDate`,
      {
        startDate: formatDate(startDateInput),
        endDate: formatDate(endDateInput),
      },
    );
  }

  protected addPagination({ start, limit }: BaseFindParameters): void {
    if (start && limit) {
      this.query = this.query.skip(start).take(limit);
    } else if (start) {
      this.query = this.query.skip(start);
    } else if (limit) {
      this.query = this.query.take(limit);
    }
  }

  protected addId({ id }: BaseGetParameters): void {
    if (id) {
      this.query = this.query.andWhere(`${this.getAliasPrefix()}id = :id`, {
        id,
      });
    }
  }

  protected orderByDate(): void {
    this.query = this.query.orderBy(`${this.getAliasPrefix()}date`);
  }
}

export default BaseFindParametersQueryBuilder;
