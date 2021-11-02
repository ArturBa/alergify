import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { FoodLogEntity } from '../entity/food-logs.entity';
import { FoodLog } from '../interfaces/food-logs.interface';
import { UserEntity } from '../entity/users.entity';
import { CreateFoodLogDto } from '../dtos/food-logs.dto';

class FoodLogsService {
  public foodLogs = FoodLogEntity;
  public users = UserEntity;

  public async getUserFoodLogs(userId: number): Promise<FoodLog[]> {
    const usersRepository = getRepository(this.users);
    const user = await usersRepository.findOne({
      where: { id: userId },
      relations: ['foodLogs'],
    });
    return user.foodLogs;
  }

  public async createUserFoodLogs(
    userId: number,
    foodLog: CreateFoodLogDto,
  ): Promise<void> {
    const foodLogsRepository = getRepository(this.foodLogs);
    const usersRepository = getRepository(this.users);
    const user = await usersRepository.findOne({ where: { id: userId } });

    const foodLogEntity = new FoodLogEntity();
    foodLogEntity.user = user;
    foodLogEntity.date = new Date(foodLog.date);
    // const user = await usersRepository.findOne({
    //   where: { id: userId },
    //   relations: ['foodLogs'],
    // });
  }

  // public async findUserById(userId: number): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

  //   const userRepository = getRepository(this.users);
  //   const findUser: User = await userRepository.findOne({
  //     where: { id: userId },
  //   });
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   return findUser;
  // }

  // public async createUser(userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

  //   const userRepository = getRepository(this.users);
  //   const findUser: User = await userRepository.findOne({
  //     where: { email: userData.email },
  //   });
  //   if (findUser)
  //     throw new HttpException(
  //       409,
  //       `You're email ${userData.email} already exists`,
  //     );

  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   const createUserData: User = await userRepository.save({
  //     ...userData,
  //     password: hashedPassword,
  //   });

  //   return createUserData;
  // }

  // public async updateUser(
  //   userId: number,
  //   userData: CreateUserDto,
  // ): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

  //   const userRepository = getRepository(this.users);
  //   const findUser: User = await userRepository.findOne({
  //     where: { id: userId },
  //   });
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   await userRepository.update(userId, {
  //     ...userData,
  //     password: hashedPassword,
  //   });

  //   const updateUser: User = await userRepository.findOne({
  //     where: { id: userId },
  //   });
  //   return updateUser;
  // }

  // public async deleteUser(userId: number): Promise<User> {
  //   if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

  //   const userRepository = getRepository(this.users);
  //   const findUser: User = await userRepository.findOne({
  //     where: { id: userId },
  //   });
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   await userRepository.delete({ id: userId });
  //   return findUser;
  // }
}

export default FoodLogsService;
