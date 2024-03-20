import { BadRequestException, Injectable } from '@nestjs/common';
import { Comment } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  async create(comment: Comment) {
    try {
      const newComment = await this.prismaService.comment.create({
        data: comment,
      });
      return newComment;
    } catch (error) {
      throw error;
    }
  }

  async update(comment: Comment) {
    try {
      const updatedComment = await this.prismaService.comment.update({
        where: { id: comment.id },
        data: comment,
      });

      return updatedComment;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const comments = await this.prismaService.comment.findMany();

    if (comments.length === 0) {
      throw new BadRequestException('Comments not found');
    }

    return comments;
  }

  async findOne(id: number) {
    try {
      const comment = await this.prismaService.comment.findUniqueOrThrow({
        where: { id: id },
      });

      return comment;
    } catch (error) {
      throw error;
    }
  }
}
