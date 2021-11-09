import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { RequestWithUser } from '@interfaces/internal/auth.interface';
import HttpStatusCode from '@interfaces/internal/http-codes.interface';

class UserController {
  public userService = new userService();

  public getUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.userId;
      let userData: Partial<User> = await this.userService.findUserById(userId);
      userData = { username: userData.username, email: userData.email };

      res.status(HttpStatusCode.OK).json(userData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(
        userId,
        userData,
      );

      res
        .status(HttpStatusCode.OK)
        .json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res
        .status(HttpStatusCode.OK)
        .json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
