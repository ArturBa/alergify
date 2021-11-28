import { PaginateParameters } from '@interfaces/internal/parameters.interface';
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { decorate } from 'ts-mixer';

export class PaginateDto implements PaginateParameters {
  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(Min(0))
  start: number;

  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(Min(0))
  limit: number;
}

@ValidatorConstraint({ name: 'date before', async: false })
class StartEndDateSuccessionValidator implements ValidatorConstraintInterface {
  static readonly startDate = 'startDate';

  // eslint-disable-next-line class-methods-use-this
  validate(endDateString: string, args: ValidationArguments): boolean {
    const startDate = new Date(
      args.object[StartEndDateSuccessionValidator.startDate],
    );
    const endDate = new Date(endDateString);

    if (endDate < startDate) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  defaultMessage(args: ValidationArguments) {
    return `EndDate: ($value) is before startDate: (${
      args.object[StartEndDateSuccessionValidator.startDate]
    })`;
  }
}

// implements DateParameters but date is passed as a string
export class DateDto {
  @decorate(IsOptional())
  @decorate(IsString())
  @decorate(IsISO8601())
  startDate: string;

  @decorate(IsOptional())
  @decorate(IsString())
  @decorate(IsISO8601())
  @decorate(Validate(StartEndDateSuccessionValidator))
  endDate: string;
}
