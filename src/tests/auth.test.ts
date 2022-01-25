import bcrypt from 'bcrypt';
import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';

import AuthRoute from '@routes/auth.route';
import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

import App from '@/app';

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    const userData: CreateUserDto = {
      email: 'test@email.com',
      password: 'q1w2e3r4!',
      username: 'testUser',
    };

    it('response should have the create userData', async () => {
      const authRoute = new AuthRoute();
      const { users } = authRoute.authController.authService;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue(null);
      userRepository.save = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}signup`)
        .send(userData)
        .expect(HttpStatusCode.OK);
    });
    it('should return 200 if user already exists', async () => {
      const authRoute = new AuthRoute();
      const { users } = authRoute.authController.authService;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue({ ...userData });
      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}signup`)
        .send(userData)
        .expect(HttpStatusCode.OK);
    });
  });

  describe('[POST] /login', () => {
    let app: App;
    const authRoute = new AuthRoute();
    const userData: CreateUserDto = {
      email: 'test@email.com',
      password: 'q1w2e3r4!',
      username: 'testUser',
    };
    const loginPath = `${authRoute.path}login`;

    beforeEach(async () => {
      const { users } = authRoute.authController.authService;
      const userRepository = getRepository(users);

      userRepository.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      app = new App([authRoute]);
    });

    it('response should have return auth tokens', async () => {
      return request(app.getServer())
        .post(loginPath)
        .send(userData)
        .expect(HttpStatusCode.OK)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('expiresIn');
        });
    });

    it('should return error if wrong email given', async () => {
      const userDataMismatch = {
        ...userData,
        email: 'aa@aa.com',
      };
      const { users } = authRoute.authController.authService;
      const userRepository = getRepository(users);
      userRepository.findOne = jest.fn().mockReturnValue(null);

      app = new App([authRoute]);

      return request(app.getServer())
        .post(loginPath)
        .send(userDataMismatch)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });

    it('should return error if wrong password given', async () => {
      const userDataMismatch = {
        ...userData,
        password: 'aa@aa.com',
      };

      return request(app.getServer())
        .post(loginPath)
        .send(userDataMismatch)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe.skip('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return (
        request(app.getServer())
          .post(`${authRoute.path}logout`)
          // eslint-disable-next-line no-useless-escape
          .expect('Set-Cookie', /^Authorization=\;/)
      );
    });
  });
});
