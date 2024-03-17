import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async create(profile: Profile) {
    try {
      const newProfile = await this.prismaService.profile.create({
        data: profile,
      });

      return newProfile;
    } catch (error) {
      throw error;
    }
  }

  async update(profile: Profile) {
    try {
      const updatedProfile = await this.prismaService.profile.update({
        where: { userId: profile.userId },
        data: profile,
      });

      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const profiles = await this.prismaService.profile.findMany();

    if (profiles.length === 0)
      throw new BadRequestException('Profiles not found');

    return profiles;
  }

  async findOne(userId: number) {
    try {
      const profile = await this.prismaService.profile.findUniqueOrThrow({
        where: {
          userId: userId,
        },
      });

      return profile;
    } catch (error) {
      throw error;
    }
  }
}
