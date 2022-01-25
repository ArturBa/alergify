import { createConnection, getRepository, Repository } from 'typeorm';
import request from 'supertest';

import { dbConnection } from '@databases';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import SymptomsRoute from '@routes/symptom.route';
import App from '@/app';

import { loginUser } from './utils/jwt.test';
import { createQueryBuilderMock } from './utils/repository.test';

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
  let repository: Repository<any>;

  const symptomsRoute = new SymptomsRoute();
  const symptoms = [
    { id: 1, name: 'rush' },
    { id: 2, name: 'fever' },
    { id: 3, name: 'cough' },
    { id: 4, name: 'sore throat' },
    { id: 5, name: 'headache' },
    { id: 6, name: 'vomiting' },
  ];

  beforeEach(() => {
    const { entity } = symptomsRoute.symptomsController.symptomService;
    repository = getRepository(entity);

    repository.createQueryBuilder = createQueryBuilderMock({
      getMany: symptoms,
    });
    app = new App([symptomsRoute]);
  });

  describe(`[GET] ${symptomsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(symptomsRoute.path)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return symptoms', async () => {
      await request(app.getServer())
        .get(symptomsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body).toEqual(symptoms);
        });

      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
    });
  });
});
