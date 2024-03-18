import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto';
import { Profile } from '@prisma/client';

const profileServiceMock = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: profileServiceMock }],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(profileController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const profile: ProfileDto = {
        userId: 1,
        bio: 'EDQBxEdQpejDrnhTwNav',
      };

      profileServiceMock.create.mockResolvedValue(profile);

      const result = await profileController.create(profile);
      expect(result).toEqual(profile);
      expect(profileServiceMock.create).toHaveBeenCalledWith(profile);
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const profile: ProfileDto = {
        userId: 1,
        bio: 'utrYerfHIBZlPOevesFk',
      };

      profileServiceMock.update.mockResolvedValue(profile);

      const result = await profileController.update(profile);
      expect(result).toEqual(profile);
      expect(profileServiceMock.update).toHaveBeenCalledWith(profile);
    });
  });

  describe('findAll', () => {
    it('should return an array of profile', async () => {
      const profiles: Profile[] = [
        {
          userId: 1,
          bio: 'utrYerfHIBZlPOevesFk',
          id: 1,
        },
      ];

      profileServiceMock.findAll.mockResolvedValue(profiles);

      const result = await profileController.findAll();
      expect(result).toEqual(profiles);
      expect(profileServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a profile', async () => {
      const profile: Profile = {
        userId: 1,
        bio: 'utrYerfHIBZlPOevesFk',
        id: 1,
      };

      profileServiceMock.findOne.mockResolvedValue(profile);

      const result = await profileController.findOne(profile.userId);
      expect(result).toEqual(profile);
      expect(profileServiceMock.findOne).toHaveBeenCalledWith(profile.userId);
    });
  });
});
