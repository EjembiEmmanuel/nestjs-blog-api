import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Role } from '../common/enums';
import { User } from './interfaces';

const usersServiceMock = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: CreateUserDto = {
        email: 'test@email.com',
        password: 'password123',
        name: 'test',
        role: Role.ADMIN,
      };

      usersServiceMock.create.mockResolvedValue(user);

      const result = await controller.create(user);
      expect(result).toEqual(user);
      expect(usersServiceMock.create).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user: UpdateUserDto = {
        id: 1,
        email: 'test@email.com',
        password: 'password123',
        name: 'test',
        role: Role.ADMIN,
      };

      usersServiceMock.update.mockResolvedValue(user);

      const result = await controller.update(user);
      expect(result).toEqual(user);
      expect(usersServiceMock.update).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          email: 'test@test.com',
          password: 'password',
          name: 'Test User',
          role: Role.ADMIN,
        },
      ];

      usersServiceMock.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
      expect(usersServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user: User = {
        id: 1,
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
        role: Role.ADMIN,
      };

      const id: number = 1;

      usersServiceMock.findOne.mockResolvedValue(user);

      const result = await controller.findOne(id);
      expect(result).toEqual(user);
      expect(usersServiceMock.findOne).toHaveBeenCalledWith(id);
    });
  });
});
