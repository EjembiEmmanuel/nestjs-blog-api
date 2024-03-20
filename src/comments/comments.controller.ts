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
import { CommentsService } from './comments.service';
import { PrismaExceptionFilter } from '../common/filters';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Controller('comments')
@UseFilters(PrismaExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  create(@Body() post: CreateCommentDto) {
    return this.commentsService.create(post);
  }

  @Patch()
  update(@Body() post: UpdateCommentDto) {
    return this.commentsService.update(post);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }
}
