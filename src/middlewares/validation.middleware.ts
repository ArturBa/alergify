import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpException from '@exceptions/HttpException';

const constrains = (error: ValidationError): any => {
  return error.constraints || [...error.children.map(c => constrains(c))][0];
};

const queryParamsToNumeric = (query: any): any => {
  const queryParams = Object.keys(query);
  queryParams.forEach((param: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(query[param])) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    query[param] = parseInt(query[param], 10);
  });
  return query;
};

const validationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    const checkObject =
      value === 'query'
        ? plainToInstance(type, queryParamsToNumeric(req[value]))
        : plainToInstance(type, req[value]);
    validate(checkObject, {
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
