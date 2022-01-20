import { createConnection, Repository } from 'typeorm';
import request from 'supertest';

import { dbConnection } from '@databases';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import SymptomLogsRoute from '@routes/symptom-log.route';
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

describe('Testing symptom logs', () => {
  let app: App;

  const symptomLogsRoute = new SymptomLogsRoute();

  let repository: Repository<any>;
  const date = new Date().toISOString();
  const symptomLogs = [
    {
      id: 1,
      date,
      intensityLogs: [{ symptomId: 1, symptomLogId: 1, value: 5 }],
    },
  ];

  let intensityLogRepository: Repository<any>;
  const intensityLog = [{ id: 1, name: 'rush' }];

  let symptomRepository: Repository<any>;
  const symptoms = [{ id: 1, name: 'rush' }];

  beforeEach(() => {
    const { entity } = symptomLogsRoute.symptomLogsController.symptomLogService;
    repository = repositoryMock(entity, { getMany: symptomLogs });

    const { entity: intensityLogEntity } =
      symptomLogsRoute.symptomLogsController.symptomLogService
        .intensityLogService;
    intensityLogRepository = repositoryMock(intensityLogEntity, {
      getMany: intensityLog,
    });

    const { entity: symptomEntity } =
      symptomLogsRoute.symptomLogsController.symptomLogService
        .intensityLogService.symptomsService;
    symptomRepository = repositoryMock(symptomEntity, { getMany: symptoms });

    symptomLogsRoute.symptomLogsController.allergensController =
      getAllergensControllerMock();

    app = new App([symptomLogsRoute]);
  });

  describe(`[GET] ${symptomLogsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(symptomLogsRoute.path)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should response valid', async () => {
      await request(app.getServer())
        .get(symptomLogsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then(({ body }) => {
          expect(body.total).toEqual(symptomLogs.length);
        });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getCount).toHaveBeenCalledTimes(1);
    });
    it('should response valid with pagination', async () => {
      await request(app.getServer())
        .get(symptomLogsRoute.path)
        .auth(accessToken, { type: 'bearer' })
        .query({ start: '1', limit: '10' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body.total).toEqual(symptomLogs.length);
        });
      expect(repository.createQueryBuilder().getMany).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder().getCount).toHaveBeenCalledTimes(1);
    });
  });

  describe(`[GET] ${symptomLogsRoute.path}/:id`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .get(`${symptomLogsRoute.path}/1`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return not found if id no number', () => {
      return request(app.getServer())
        .get(`${symptomLogsRoute.path}/no_number`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NOT_FOUND);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .get(`${symptomLogsRoute.path}/1`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then(res => {
          expect(res.body).toEqual(symptomLogs[0]);
        });
      expect(repository.createQueryBuilder().getOne).toHaveBeenCalledTimes(1);
    });
  });

  describe(`[POST] ${symptomLogsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .post(`${symptomLogsRoute.path}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .post(`${symptomLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('request should return found a valid response', async () => {
      const newSymptomLog = {
        date,
        intensityLogs: [{ value: 1, symptomId: 1 }],
      };

      await request(app.getServer())
        .post(`${symptomLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .send(newSymptomLog)
        .expect(HttpStatusCode.CREATED);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(intensityLogRepository.save).toHaveBeenCalledTimes(1);
      expect(
        symptomRepository.createQueryBuilder().getOne,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe(`[PUT] ${symptomLogsRoute.path}`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .put(`${symptomLogsRoute.path}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 400 if wrong params', () => {
      return request(app.getServer())
        .put(`${symptomLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.BAD_REQUEST);
    });
    it('request should return found a valid response', async () => {
      const newSymptomLog = {
        date,
        intensityLogs: [{ value: 1, symptomId: 1 }],
        id: 1,
      };
      await request(app.getServer())
        .put(`${symptomLogsRoute.path}`)
        .auth(accessToken, { type: 'bearer' })
        .send(newSymptomLog)
        .expect(HttpStatusCode.NO_CONTENT);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(intensityLogRepository.save).toHaveBeenCalledTimes(1);
      expect(
        symptomRepository.createQueryBuilder().getOne,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe(`[DELETE] ${symptomLogsRoute.path}/1`, () => {
    it('user should be authorized', () => {
      return request(app.getServer())
        .delete(`${symptomLogsRoute.path}/1`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return 404 if wrong params', () => {
      return request(app.getServer())
        .delete(`${symptomLogsRoute.path}/non_number`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NOT_FOUND);
    });
    it('request should return found a valid response', async () => {
      await request(app.getServer())
        .delete(`${symptomLogsRoute.path}/1`)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NO_CONTENT);
      expect(repository.remove).toHaveBeenCalledTimes(1);
    });
  });
});
