import { NextFunction, Request, Response } from 'express';

import { CreateUserDto } from '@dtos/users.dto';
import { JsonWebToken } from '@utils/jwt';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      await this.authService.signup(userData);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const tokenData = await this.authService.login(userData);

      res.status(HttpStatusCode.OK).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // TODO: Implement logout
      const { userId } = req;
      await this.authService.logout(userId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: number = req.userId;
      const tokenData = JsonWebToken.createToken(userData);

      res.status(HttpStatusCode.OK).json(tokenData);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
