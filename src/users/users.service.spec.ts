import { UsersService } from './users.service';
import { User } from './interfaces';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../common/enums';
import * as argon from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';

// Mocking argon library
jest.mock('argon2', () => ({
  hash: jest
    .fn()
    .mockImplementation(async (password: string) => `hashed_${password}`),
}));

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

      const passwordWithoutHash = newUser.password;
      const hashedPassword = await argon.hash(passwordWithoutHash);
      newUser.password = hashedPassword;

      expect(argon.hash).toHaveBeenCalledWith(passwordWithoutHash);

      prismaServiceMock.user.create.mockResolvedValue(newUser);

      const result = await usersService.create(newUser);
      expect(result).toEqual(newUser);
    });

    it('should throw ForbiddenException if credentials are taken', async () => {
      const newUser: User = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.ADMIN,
      };

      prismaServiceMock.user.create.mockRejectedValue(
        new ForbiddenException('Credentials taken'),
      );

      await expect(usersService.create(newUser)).rejects.toThrow(
        new ForbiddenException('Credentials taken'),
      );
    });
  });

  // Similar tests can be written for other methods like update, findAll, and findOne
});
