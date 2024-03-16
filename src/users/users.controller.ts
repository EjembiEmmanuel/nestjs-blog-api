import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { PrismaExceptionFilter } from '../common/filters';

@Controller('users')
@UseFilters(PrismaExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  update(
    @Body(new ValidationPipe({ transform: true })) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(updateUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
