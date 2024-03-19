import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignIn, User } from './interfaces';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(user: User) {
    return this.usersService.create(user);
  }

  async signIn(signIn: SignIn) {
    try {
      const user = await this.usersService.findOneByEmail(signIn.email);

      const passwordMatched = await argon.verify(
        user.password,
        signIn.password,
      );

      if (!passwordMatched) {
        throw new UnauthorizedException('Incorrect password');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
