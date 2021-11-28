import { Router } from 'express';
import UsersController from '@controllers/user.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/internal/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@middlewares/auth.middleware';

class UserRoute implements Routes {
  public path = '/me';

  public router = Router();

  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.usersController.getUser,
    );
    this.router.put(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateUserDto),
      this.usersController.updateUser,
    );
    this.router.delete(
      `${this.path}`,
      authMiddleware,
      this.usersController.deleteUser,
    );
  }
}

export default UserRoute;
