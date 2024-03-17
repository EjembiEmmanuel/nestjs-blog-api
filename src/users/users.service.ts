import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './interfaces';
import * as argon from 'argon2';

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
      throw error;
    }
  }

  async findAll() {
    const users = await this.prismaService.user.findMany();

    if (users.length === 0) {
      throw new BadRequestException('Users not found');
    }
    return users;
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    return user;
  }
}
