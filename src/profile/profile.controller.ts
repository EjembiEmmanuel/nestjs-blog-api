import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileDto } from './dto';
import { ProfileService } from './profile.service';
import { PrismaExceptionFilter } from '../common/filters';

@Controller('profile')
@UseFilters(PrismaExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  create(
    @Body()
    profileDto: ProfileDto,
  ) {
    return this.profileService.create(profileDto);
  }

  @Patch()
  update(@Body() profileDto: ProfileDto) {
    return this.profileService.update(profileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number) {
    return this.profileService.findOne(userId);
  }
}
