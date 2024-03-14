import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interfaces';
import * as argon from 'argon2';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(user: User) {
    try {
      const hashedPassword = await argon.hash(user.password);

      const newUser = await this.prismaService.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role: user.role,
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async update(user: User) {
    try {
      const updateData: any = {
        email: user.email,
        name: user.name,
        role: user.role,
      };

      if (user.password) {
        const hashedPassword = await argon.hash(user.password);
        updateData.password = hashedPassword;
      }

      const updatedUser = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: updateData,
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('User not found');
        }
      } else if (error instanceof PrismaClientValidationError) {
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prismaService.user.findMany();

    if (!users) {
      throw new BadRequestException('Users not found');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
