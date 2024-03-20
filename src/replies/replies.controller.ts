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
import { RepliesService } from './replies.service';
import { PrismaExceptionFilter } from '../common/filters';
import { CreateReplyDto, UpdateReplyDto } from './dto';

@Controller('replies')
@UseFilters(PrismaExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class RepliesController {
  constructor(private repliesService: RepliesService) {}

  @Post()
  create(@Body() reply: CreateReplyDto) {
    return this.repliesService.create(reply);
  }

  @Patch()
  update(@Body() reply: UpdateReplyDto) {
    return this.repliesService.update(reply);
  }

  @Get()
  findAll() {
    return this.repliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.repliesService.findOne(id);
  }
}
