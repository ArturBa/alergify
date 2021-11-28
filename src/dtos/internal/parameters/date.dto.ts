import {
  IsISO8601,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { decorate } from 'ts-mixer';

@ValidatorConstraint({ name: 'start end date succession', async: false })
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

export default DateDto;
