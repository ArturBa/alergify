import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entity/users.entity';

import { User } from '@interfaces/users.interface';
import { TokenData } from '@interfaces/auth.interface';
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

    userData.password = await bcrypt.hash(userData.password, 10);
    await userRepository.save({ ...userData });
    return;
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

    const tokenData = JsonWebToken.createToken(findUser);
    return tokenData;
  }

  public async logout(userData: User): Promise<User> {
    checkIfEmpty(userData);

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email, password: userData.password },
    });
    checkIfConflict(!findUser);

    return findUser;
  }
}

export default AuthService;
