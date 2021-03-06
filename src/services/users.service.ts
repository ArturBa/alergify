import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entity/users.entity';
import { User } from '@interfaces/users.interface';
import { checkIfConflict, checkIfEmpty } from './internal/common.service';

class UserService {
  public users = UserEntity;

  public async findUserById(userId: number): Promise<Partial<User>> {
    checkIfEmpty(userId);

    const userRepository = getRepository(this.users);
    const findUser = await userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email'],
    });
    checkIfConflict(!findUser);

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    checkIfEmpty(userData);

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email },
    });
    checkIfConflict(!findUser, 'Email already exist');

    const createUserData: User = await userRepository.save({
      ...userData,
    });

    return createUserData;
  }

  public async updateUser(
    userId: number,
    userData: CreateUserDto,
  ): Promise<User> {
    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { id: userId },
    });

    findUser.username = userData.username;
    findUser.email = userData.email;
    findUser.password = bcrypt.hashSync(userData.password, 10);

    userRepository.update(userId, {
      ...userData,
    });

    const updateUser: User = await userRepository.findOne({
      where: { id: userId },
    });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    checkIfEmpty(userId);

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { id: userId },
    });
    checkIfConflict(!findUser);

    await userRepository.delete({ id: userId });
    return findUser;
  }
}

export default UserService;
