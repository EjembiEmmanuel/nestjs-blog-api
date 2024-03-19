import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { Role } from '../common/enums';
import { SignIn } from './interfaces';

const authServiceMock = {
  signUp: jest.fn(),
  signIn: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a user', async () => {
      const user: SignUpDto = {
        email: 'kuvcalap@ewuis.mh',
        password: 'yIYaEbDzJY',
        name: 'ooKIA',
        role: Role.ADMIN,
      };

      authServiceMock.signUp.mockResolvedValue(user);

      const result = await authController.signUp(user);
      expect(result).toEqual(user);
      expect(authServiceMock.signUp).toHaveBeenCalledWith(user);
    });
  });

  describe('signIn', () => {
    it('should sign in a user', async () => {
      const user: SignIn = {
        email: 'kuvcalap@ewuis.mh',
        password: 'yIYaEbDzJY',
      };

      authServiceMock.signIn.mockResolvedValue(user);

      const result = await authController.signIn(user);
      expect(result).toEqual(user);
      expect(authServiceMock.signIn).toHaveBeenCalledWith(user);
    });
  });
});
