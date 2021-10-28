import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { CreateUserDto } from '@dtos/users.dto';
import { UserEntity } from '@entity/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

import { User } from '@interfaces/users.interface';
import HttpStatusCode from '@interfaces/http-codes.interface';
import { JsonWebToken } from '../utils/jwt';
import { TokenData } from '../interfaces/auth.interface';

class AuthService {
  public users = UserEntity;

  public async signup(userData: CreateUserDto): Promise<void> {
    if (isEmpty(userData))
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Missing data');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (findUser)
      throw new HttpException(
        HttpStatusCode.CONFLICT,
        'Email already registered',
      );

    await userRepository.save({ ...userData });
    return;
  }

  public async login(userData: CreateUserDto): Promise<TokenData> {
    if (isEmpty(userData))
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Missing data');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email },
    });
    if (!findUser)
      throw new HttpException(
        HttpStatusCode.CONFLICT,
        'Email and password mismatch',
      );

    const isPasswordMatching: boolean = await bcrypt.compare(
      userData.password,
      findUser.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(
        HttpStatusCode.CONFLICT,
        'Email and password mismatch',
      );

    const tokenData = JsonWebToken.createToken(findUser);
    return tokenData;
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData))
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Missing data');

    const userRepository = getRepository(this.users);
    const findUser: User = await userRepository.findOne({
      where: { email: userData.email, password: userData.password },
    });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }
}

export default AuthService;
