import { UsersService } from './users.service';
import { User } from './interfaces';
import { Role } from '../common/enums';
import * as argon from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Mocking argon library
jest.mock('argon2');

// Mocking PrismaService
const prismaServiceMock = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: User = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      (argon.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const passwordWithoutHash = newUser.password;
      const hashedPassword = await argon.hash(passwordWithoutHash);
      newUser.password = hashedPassword;

      prismaServiceMock.user.create.mockResolvedValue(newUser);

      const result = await usersService.create(newUser);
      expect(argon.hash).toHaveBeenCalledWith(passwordWithoutHash);
      expect(result).toEqual(newUser);
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          password: newUser.password,
        },
      });
    });

    it('should throw ForbiddenException if credentials are taken', async () => {
      const newUser: User = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      prismaServiceMock.user.create.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the {constraint}',
          {
            code: 'P2002',
            clientVersion: '5.11.0',
            meta: { target: ['email'] },
          },
        ),
      );

      await expect(usersService.create(newUser)).rejects.toThrow(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the {constraint}',
          {
            code: 'P2002',
            clientVersion: '5.11.0',
            meta: { target: ['email'] },
          },
        ),
      );
    });
  });

  describe('update', () => {
    it('should update user without password', async () => {
      const user: any = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: Role.ADMIN,
      };

      prismaServiceMock.user.update.mockResolvedValue(user);

      const result = await usersService.update(user);
      expect(result).toEqual(user);
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    });

    it('should update user with password', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      (argon.hash as jest.Mock).mockResolvedValue('hashedPassword');
      const passwordWithoutHash = user.password;
      const hashedPassword = await argon.hash(passwordWithoutHash);
      user.password = hashedPassword;

      prismaServiceMock.user.update.mockResolvedValue(user);

      const result = await usersService.update(user);
      expect(argon.hash).toHaveBeenCalledWith(passwordWithoutHash);
      expect(result).toEqual(user);
      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          name: user.name,
          role: user.role,
          password: user.password,
        },
      });
    });

    it('should throw exception if user not found', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      prismaServiceMock.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '5.11.0',
          meta: { modelName: 'USER' },
        }),
      );

      await expect(usersService.update(user)).rejects.toThrow(
        new PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '5.11.0',
          meta: { modelName: 'USER' },
        }),
      );
    });

    it('should throw exception if credentials are taken', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      prismaServiceMock.user.update.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the {constraint}',
          {
            code: 'P2002',
            clientVersion: '5.11.0',
            meta: { target: ['email'] },
          },
        ),
      );

      await expect(usersService.update(user)).rejects.toThrow(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the {constraint}',
          {
            code: 'P2002',
            clientVersion: '5.11.0',
            meta: { target: ['email'] },
          },
        ),
      );
    });
  });
});
