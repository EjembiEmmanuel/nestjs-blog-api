import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from './interfaces';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException } from '@nestjs/common';

// Mocking PrismaService
const prismaServiceMock = {
  profile: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
};

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const newProfile: Profile = {
        userId: 1,
        bio: 'Hello world!',
      };

      prismaServiceMock.profile.create.mockResolvedValue(newProfile);

      const result = await profileService.create(newProfile);
      expect(result).toEqual(newProfile);
      expect(prismaServiceMock.profile.create).toHaveBeenCalledWith({
        data: {
          userId: newProfile.userId,
          bio: newProfile.bio,
        },
      });
    });

    it('should throw exception if profile already exists', async () => {
      const newProfile: Profile = {
        userId: 1,
        bio: 'Hello world!',
      };

      prismaServiceMock.profile.create.mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the {constraint}',
          {
            code: 'P2002',
            clientVersion: '5.11.0',
            meta: { target: ['email'] },
          },
        ),
      );

      await expect(profileService.create(newProfile)).rejects.toThrow(
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
    it('should create update profile', async () => {
      const profile: Profile = {
        userId: 1,
        bio: 'Hello world!',
      };

      prismaServiceMock.profile.update.mockResolvedValue(profile);

      const result = await profileService.update(profile);
      expect(result).toEqual(profile);
      expect(prismaServiceMock.profile.update).toHaveBeenCalledWith({
        where: {
          userId: profile.userId,
        },
        data: {
          userId: profile.userId,
          bio: profile.bio,
        },
      });
    });

    it('should throw exception if profile not found', async () => {
      const newProfile: Profile = {
        userId: 1,
        bio: 'Hello world!',
      };

      prismaServiceMock.profile.create.mockRejectedValue(
        new PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '5.11.0',
          meta: { modelName: 'Profile' },
        }),
      );

      await expect(profileService.create(newProfile)).rejects.toThrow(
        new PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '5.11.0',
          meta: { modelName: 'Profile' },
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return and array of profiles', async () => {
      const profiles: Profile[] = [
        {
          userId: 1,
          bio: 'test@test.com',
        },
      ];

      prismaServiceMock.profile.findMany.mockResolvedValue(profiles);

      const result = await profileService.findAll();
      expect(result).toEqual(profiles);
      expect(prismaServiceMock.profile.findMany).toHaveBeenCalled();
    });

    it('should throw exception if there are no users found', async () => {
      prismaServiceMock.profile.findMany.mockRejectedValue(
        new BadRequestException('Profiles not found'),
      );

      await expect(profileService.findAll()).rejects.toThrow(
        new BadRequestException('Profiles not found'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a profile', async () => {
      const profile: Profile = {
        userId: 1,
        bio: 'test bio',
      };

      prismaServiceMock.profile.findUniqueOrThrow.mockResolvedValue(profile);

      const result = await profileService.findOne(profile.userId);
      expect(result).toEqual(profile);
      expect(prismaServiceMock.profile.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          userId: profile.userId,
        },
      });
    });

    it('should throw exception if no profile found', async () => {
      prismaServiceMock.profile.findUniqueOrThrow.mockRejectedValue(
        new BadRequestException('Profiles not found'),
      );

      await expect(profileService.findAll()).rejects.toThrow(
        new BadRequestException('Profiles not found'),
      );
    });
  });
});
