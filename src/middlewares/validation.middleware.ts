import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const constrains = (error: ValidationError): any => {
  console.log(error);
  return error.constraints || [...error.children.map(c => constrains(c))][0];
};

const validationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    validate(plainToClass(type, req[value]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => {
          const constraints = constrains(error);
          return Object.values(constraints)[0];
        })[0];
        next(new HttpException(400, message as string));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
