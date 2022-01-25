import { createConnection, Repository } from 'typeorm';
import request from 'supertest';

import { dbConnection } from '@databases';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import ProductRoute from '@routes/product.route';
import App from '@/app';

import { loginUser } from './utils/jwt.test';
import { repositoryMock } from './utils/repository.test';

let accessToken: string;

beforeAll(async () => {
  await createConnection(dbConnection);
  accessToken = await loginUser();
});

afterAll(async () => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing products', () => {
  let app: App;
  let repository: Repository<any>;

  const productsRoute = new ProductRoute();
  const products = [{ id: 1, name: 'apple juice', ingredients: [1] }];

  let ingredientRepository: Repository<any>;
  const ingredients = [{ id: 1, name: 'apple' }];

  beforeEach(() => {
    const { entity } = productsRoute.productsController.productService;
    repository = repositoryMock(entity, { getMany: products });

    const { entity: ingredientEntity } =
      productsRoute.productsController.productService.ingredientService;
    ingredientRepository = repositoryMock(ingredientEntity, {
      getMany: ingredients,
    });

    app = new App([productsRoute]);
  });

  describe(`[GET] ${productsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(productsRoute.path)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return bad request if no search in query', () => {
      return request(app.getServer())
        .get(productsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('should response valid', async () => {
      await request(app.getServer())
        .get(productsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .query({ name: 'apple' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body.total).toEqual(products.length);
        });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getCount).toHaveBeenCalledTimes(1);
    });
  });

  describe(`[GET] ${productsRoute.path}/:id`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(`${productsRoute.path}/1`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return not found if id no number', () => {
      return request(app.getServer())
        .get(`${productsRoute.path}/no_number`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NOT_FOUND);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .get(`${productsRoute.path}/1`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body).toEqual(products[0]);
        });
      expect(repository.createQueryBuilder().getOne).toHaveBeenCalledTimes(1);
    });
  });

  describe(`[POST] ${productsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .post(`${productsRoute.path}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .post(`${productsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .post(`${productsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .send({ name: 'apple muse', ingredients: [1] })
        .expect(HttpStatusCode.CREATED);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(
        ingredientRepository.createQueryBuilder().getOne,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
