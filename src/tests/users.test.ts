import request from 'supertest';
import { createConnection, getRepository, Repository } from 'typeorm';

import { dbConnection } from '@databases';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';

import App from '@/app';
import UserRoute from '../routes/user.route';
import { loginUser, userId } from './utils/jwt.test';

let accessToken: string;

beforeAll(async () => {
  await createConnection(dbConnection);
  accessToken = await loginUser();
});

afterAll(async () => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing User', () => {
  let app: App;
  let userRepository: Repository<any>;
  const userData: CreateUserDto = {
    email: 'test@email.com',
    password: 'q1w2e3r4!',
    username: 'testUser',
  };

  const userRoute = new UserRoute();
  const userTestRoute = userRoute.path;

  beforeEach(() => {
    const { users } = userRoute.usersController.userService;
    userRepository = getRepository(users);

    userRepository.findOne = jest.fn().mockReturnValue(userData);
    app = new App([userRoute]);
  });

  describe(`[GET] ${userTestRoute}`, () => {
    it('should require logged user', () => {
      return request(app.getServer())
        .get(userTestRoute)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return user details', () => {
      return request(app.getServer())
        .get(userTestRoute)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.OK)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('username', userData.username);
          expect(res.body).toHaveProperty('email', userData.email);
        });
    });
  });

  describe(`[PUT] ${userTestRoute}`, () => {
    const newUserData = { ...userData, username: 'newUserName' };

    beforeEach(() => {
      userRepository.findOne = jest.fn().mockReturnValue(userData);
      userRepository.update = jest.fn().mockReturnValue(newUserData);
      userRepository.delete = jest.fn().mockReturnValue(userData);
      app = new App([userRoute]);
    });

    it('should require logged user', () => {
      return request(app.getServer())
        .put(userTestRoute)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should update user details', async () => {
      await request(app.getServer())
        .put(userTestRoute)
        .send(newUserData)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NO_CONTENT);

      expect(userRepository.update).toHaveBeenCalledWith(userId, newUserData);
    });
  });

  describe(`[DELETE] ${userTestRoute}`, () => {
    it('should require logged user', () => {
      return request(app.getServer())
        .delete(userTestRoute)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should update user details', async () => {
      await request(app.getServer())
        .delete(userTestRoute)
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatusCode.NO_CONTENT);

      expect(userRepository.delete).toHaveBeenCalledWith({ id: userId });
    });
  });
});
