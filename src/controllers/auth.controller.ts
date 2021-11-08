import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import HttpStatusCode from '@interfaces/http-codes.interface';
import { JsonWebToken } from '@utils/jwt';

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

      res.sendStatus(HttpStatusCode.CREATED);
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
      //TODO: Implement logout
      const userId = req.userId;
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
