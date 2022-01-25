import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';

import { HttpException } from '@exceptions/HttpException';
import { HttpStatusCode } from '@interfaces/internal/http-codes.interface';
import { JsonWebToken } from '@utils/jwt';
import { TokenData } from '@interfaces/internal/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserEntity } from '@entity/users.entity';

import { checkIfConflict } from './internal/common.service';

class AuthService {
  public users = UserEntity;

  public async signup(userData: CreateUserDto): Promise<void> {
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
    const shouldThrowInvalidCredentials = (value: any): void => {
      if (value) {
        throw new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          'Invalid credentials',
        );
      }
    };

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email },
    });
    shouldThrowInvalidCredentials(!findUser);

    const isPasswordMatching: boolean = await bcrypt.compare(
      userData.password,
      findUser.password,
    );
    shouldThrowInvalidCredentials(!isPasswordMatching);

    const tokenData = JsonWebToken.createToken(findUser.id);
    return tokenData;
  }

  public async logout(userId: number): Promise<User> {
    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { id: userId },
    });
    checkIfConflict(!findUser);

    return findUser;
  }
}

export default AuthService;
