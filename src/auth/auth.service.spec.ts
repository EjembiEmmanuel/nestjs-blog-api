import { Test, TestingModule } from '@nestjs/testing';
import * as argon from 'argon2';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto';
import { Role } from '../common/enums';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignIn } from './interfaces';

jest.mock('argon2');

const usersServiceMock = {
  create: jest.fn(),
  findOneByEmail: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const user: SignUpDto = {
        email: 'vocit@defekbuk.sk',
        password: 'KXXsQJyJAw',
        name: 'YSlEn',
        role: Role.ADMIN,
      };

      usersServiceMock.create.mockResolvedValue(user);

      const result = await authService.signUp(user);
      expect(result).toEqual(user);
      expect(usersServiceMock.create).toHaveBeenCalledWith(user);
    });

    it('should throw exception if credentials are taken', async () => {
      const user: SignUpDto = {
        email: 'vocit@defekbuk.sk',
        password: 'KXXsQJyJAw',
        name: 'YSlEn',
        role: Role.ADMIN,
      };

      usersServiceMock.create.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the {constraint}',
          {
            code: 'P2002',
            clientVersion: '5.11.0',
            meta: { target: ['email'] },
          },
        ),
      );

      await expect(authService.signUp(user)).rejects.toThrow(
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

  describe('signIn', () => {
    it('should sign in a user with correct credentials', async () => {
      const user: SignIn = {
        email: 'vocit@defekbuk.sk',
        password: 'KXXsQJyJAw',
      };

      usersServiceMock.findOneByEmail.mockResolvedValue(user);

      (argon.verify as jest.Mock).mockResolvedValue(true);

      const result = await authService.signIn(user);
      expect(result).toEqual(user);
      expect(usersServiceMock.findOneByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should not sign in a user with incorrect credentials', async () => {
      const user: SignIn = {
        email: 'vocit@defekbuk.sk',
        password: 'KXXsQJyJAw',
      };

      usersServiceMock.findOneByEmail.mockRejectedValue(
        new UnauthorizedException('Incorrect Password'),
      );

      (argon.verify as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(user)).rejects.toThrow(
        new UnauthorizedException('Incorrect Password'),
      );
    });

    it('should throw exception if no user found', async () => {
      const user: SignIn = {
        email: 'vocit@defekbuk.sk',
        password: 'KXXsQJyJAw',
      };

      usersServiceMock.findOneByEmail.mockRejectedValue(
        new BadRequestException('Users not found'),
      );

      await expect(authService.signIn(user)).rejects.toThrow(
        new BadRequestException('Users not found'),
      );
    });
  });
});
