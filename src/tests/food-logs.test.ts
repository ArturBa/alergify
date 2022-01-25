import { createConnection, Repository } from 'typeorm';
import request from 'supertest';

import { dbConnection } from '@databases';
import FoodLogsRoute from '@routes/food-log.route';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import App from '@/app';

import { loginUser } from './utils/jwt.test';
import { repositoryMock } from './utils/repository.test';
import { getAllergensControllerMock } from './utils/allergens.test';

let accessToken: string;

beforeAll(async () => {
  await createConnection(dbConnection);
  accessToken = await loginUser();
});

afterAll(async () => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing ingredients', () => {
  let app: App;
  let repository: Repository<any>;

  const foodLogsRoute = new FoodLogsRoute();
  const foodLogs = [
    {
      id: 0,
      ingredients: [{ id: 1, name: 'apple' }],
      products: [{ id: 1, name: 'apple-juice' }],
      date: new Date().toISOString(),
    },
  ];

  let productsRepository: Repository<any>;
  const products = [{ id: 1, name: 'apple juice', ingredients: [1] }];

  let ingredientRepository: Repository<any>;
  const ingredients = [{ id: 1, name: 'apple' }];

  beforeEach(() => {
    const { entity } = foodLogsRoute.foodLogsController.foodLogsService;
    repository = repositoryMock(entity, { getMany: foodLogs });

    foodLogsRoute.foodLogsController.allergensController =
      getAllergensControllerMock();

    const { entity: productEntity } =
      foodLogsRoute.foodLogsController.foodLogsService.productsService;
    productsRepository = repositoryMock(productEntity, { getMany: products });

    const { entity: ingredientEntity } =
      foodLogsRoute.foodLogsController.foodLogsService.ingredientsService;
    ingredientRepository = repositoryMock(ingredientEntity, {
      getMany: ingredients,
    });

    app = new App([foodLogsRoute]);
  });

  describe(`GET ${foodLogsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(foodLogsRoute.path)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return valid response', async () => {
      await request(app.getServer())
        .get(foodLogsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK);
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getCount).toHaveBeenCalledTimes(1);
    });
    it('should response valid', async () => {
      await request(app.getServer())
        .get(foodLogsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .query({
          startDate: '2022-01-21T15:22:12.029Z',
          endDate: '2022-01-22T15:22:12.029Z',
        })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body.data).toEqual(foodLogs);
          expect(res.body.total).toEqual(foodLogs.length);
        });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getCount).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().andWhere).toHaveBeenCalled();
    });
  });

  describe(`[POST] ${foodLogsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .post(`${foodLogsRoute.path}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .post(`${foodLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('request should return found a valid response', async () => {
      const newFoodLog = {
        date: new Date().toISOString(),
        ingredients: [1],
        products: [1],
      };
      await request(app.getServer())
        .post(`${foodLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .send(newFoodLog)
        .expect(HttpStatusCode.CREATED);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(
        foodLogsRoute.foodLogsController.allergensController
          .addFoodLogAllergens,
      ).toHaveBeenCalled();
      expect(productsRepository.createQueryBuilder().getOne).toHaveBeenCalled();
      expect(
        ingredientRepository.createQueryBuilder().getOne,
      ).toHaveBeenCalled();
    });
  });

  describe(`[PUT] ${foodLogsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .put(`${foodLogsRoute.path}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .put(`${foodLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('request should return found a valid response', async () => {
      const newFoodLog = {
        id: 1,
        date: new Date().toISOString(),
        ingredients: [1],
        products: [1],
      };
      await request(app.getServer())
        .put(`${foodLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .send(newFoodLog)
        .expect(HttpStatusCode.NO_CONTENT);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(
        foodLogsRoute.foodLogsController.allergensController
          .diffFoodLogAllergens,
      ).toHaveBeenCalled();
      expect(productsRepository.createQueryBuilder().getOne).toHaveBeenCalled();
      expect(
        ingredientRepository.createQueryBuilder().getOne,
      ).toHaveBeenCalled();
    });
  });

  describe(`[DELETE] ${foodLogsRoute.path}/:id`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .delete(`${foodLogsRoute.path}/1`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .delete(`${foodLogsRoute.path}/not-number`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NOT_FOUND);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .delete(`${foodLogsRoute.path}/1`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NO_CONTENT);
      expect(repository.remove).toHaveBeenCalledTimes(1);
      expect(
        foodLogsRoute.foodLogsController.allergensController
          .removeFoodLogAllergens,
      ).toHaveBeenCalled();
    });
  });
});
