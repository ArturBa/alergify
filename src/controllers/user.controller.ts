import { NextFunction, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import UserService from '@services/users.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';

class UserController {
  public userService = new UserService();

  public getUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req;
      let userData: Partial<User> = await this.userService.findUserById(userId);
      userData = { username: userData.username, email: userData.email };

      res.status(HttpStatusCode.OK).json(userData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      await this.userService.updateUser(req.userId, userData);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.userService.deleteUser(req.userId);

      res.sendStatus(HttpStatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
