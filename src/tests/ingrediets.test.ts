import { createConnection, Repository } from 'typeorm';
import request from 'supertest';

import { dbConnection } from '@databases';
import IngredientRoute from '@routes/ingredient.route';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
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

describe('Testing ingredients', () => {
  let app: App;
  let repository: Repository<any>;

  const ingredientsRoute = new IngredientRoute();
  const ingredients = [{ id: 1, name: 'apple' }];

  beforeEach(() => {
    const { entity } = ingredientsRoute.ingredientsController.ingredientService;
    repository = repositoryMock(entity, { getMany: ingredients });

    app = new App([ingredientsRoute]);
  });

  describe(`[GET] ${ingredientsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(ingredientsRoute.path)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return bad request if no search in query', () => {
      return request(app.getServer())
        .get(ingredientsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('should response valid', async () => {
      await request(app.getServer())
        .get(ingredientsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .query({ name: 'apple' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body.data).toEqual(ingredients);
          expect(res.body.total).toEqual(ingredients.length);
        });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getCount).toHaveBeenCalledTimes(1);
    });
  });
  describe(`[GET] ${ingredientsRoute.path}/:id`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(`${ingredientsRoute.path}/1`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return not found if id no number', () => {
      return request(app.getServer())
        .get(`${ingredientsRoute.path}/no_number`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NOT_FOUND);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .get(`${ingredientsRoute.path}/1`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body).toEqual(ingredients[0]);
        });
      expect(repository.createQueryBuilder().getOne).toHaveBeenCalledTimes(1);
    });
  });
  describe(`[POST] ${ingredientsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .post(`${ingredientsRoute.path}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .post(`${ingredientsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .post(`${ingredientsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .send({ name: 'apple' })
        .expect(HttpStatusCode.CREATED);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });
});
