import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import request from 'supertest';

import AuthRoute from '@routes/auth.route';
import App from '@/app';
import { HttpStatusCode } from '../../interfaces/internal/http-codes.interface';

export const userId = 1;

export async function loginUser(): Promise<string> {
  const authRoute = new AuthRoute();
  const { users } = authRoute.authController.authService;

  const userData = {
    email: 'user@email.com',
    password: 'q1w2e3r4!',
  };
  const userRepository = getRepository(users);

  userRepository.findOne = jest.fn().mockReturnValue({
    id: userId,
    email: userData.email,
    password: await bcrypt.hash(userData.password, 10),
  });
  const app = new App([authRoute]);

  return request(app.getServer())
    .post(`${authRoute.path}login`)
    .send(userData)
    .expect(HttpStatusCode.OK)
    .then((res: request.Response) => {
      return res.body.accessToken;
    });
}
