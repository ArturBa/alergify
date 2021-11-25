import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entity/users.entity';

import { User } from '@interfaces/users.interface';
import { TokenData } from '@interfaces/internal/auth.interface';
import { JsonWebToken } from '@utils/jwt';
import { checkIfConflict, checkIfEmpty } from './common.service';

class AuthService {
  public users = UserEntity;

  public async signup(userData: CreateUserDto): Promise<void> {
    checkIfEmpty(userData);

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (findUser) {
      return;
    }

    const user = {
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
    };
    await userRepository.save({ ...user });
  }

  public async login(userData: CreateUserDto): Promise<TokenData> {
    checkIfEmpty(userData);

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email },
    });
    checkIfConflict(!findUser, 'Email and password mismatch');

    const isPasswordMatching: boolean = await bcrypt.compare(
      userData.password,
      findUser.password,
    );
    checkIfConflict(!isPasswordMatching, 'Email and password mismatch');

    const tokenData = JsonWebToken.createToken(findUser.id);
    return tokenData;
  }

  public async logout(userId: number): Promise<User> {
    checkIfEmpty(userId);

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { id: userId },
    });
    checkIfConflict(!findUser);

    return findUser;
  }
}

export default AuthService;
