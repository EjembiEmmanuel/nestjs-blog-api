import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignIn, User } from './interfaces';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: User) {
    try {
      const newUser = await this.usersService.create(user);

      const payload = {
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
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

      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
