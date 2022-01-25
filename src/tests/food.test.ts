import { createConnection, getRepository, Repository } from 'typeorm';
import request from 'supertest';

import { dbConnection } from '@databases';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import FoodsRoute from '@routes/food.route';
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

describe('Testing symptoms', () => {
  let app: App;

  const foodsRoute = new FoodsRoute();

  let productRepository: Repository<any>;
  const products = [{ id: 1, name: 'apple juice', ingredients: [1] }];

  let ingredientRepository: Repository<any>;
  const ingredients = [{ id: 1, name: 'apple' }];

  beforeEach(() => {
    const { entity: ingredientEntity } =
      foodsRoute.foodsController.foodService.ingredientService;
    ingredientRepository = repositoryMock(ingredientEntity, {
      getMany: ingredients,
    });

    const { entity: productEntity } =
      foodsRoute.foodsController.foodService.productService;
    productRepository = repositoryMock(productEntity, {
      getMany: products,
    });

    app = new App([foodsRoute]);
  });

  describe(`[GET] ${foodsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(foodsRoute.path)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return bad request if no search given', async () => {
      await request(app.getServer())
        .get(foodsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('should return foods', async () => {
      await request(app.getServer())
        .get(foodsRoute.path)
        .query({ name: 'apple' })
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body.total).toEqual(products.length + ingredients.length);
        });
      expect(
        productRepository.createQueryBuilder().getMany,
      ).toHaveBeenCalledTimes(1);
      expect(
        productRepository.createQueryBuilder().getCount,
      ).toHaveBeenCalledTimes(1);
      expect(
        ingredientRepository.createQueryBuilder().getMany,
      ).toHaveBeenCalledTimes(1);
      expect(
        ingredientRepository.createQueryBuilder().getCount,
      ).toHaveBeenCalledTimes(2);
    });
  });
});
