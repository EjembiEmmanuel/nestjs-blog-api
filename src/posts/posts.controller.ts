import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaExceptionFilter } from '../common/filters';
import { RolesGuard } from '../auth/guards';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';

@Controller('posts')
@UseFilters(PrismaExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() post: CreatePostDto) {
    return this.postsService.create(post);
  }

  @Patch()
  update(@Body() post: UpdatePostDto) {
    return this.postsService.update(post);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }
}
